<?php

namespace Tests\Feature;

use App\Mail\CompanyInvitationMail;
use App\Models\Company;
use App\Models\CompanyInvitation;
use App\Models\CompanyRole;
use App\Models\Sector;
use App\Models\User;
use App\Models\UserRole;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CompanyInvitationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CatalogSeeder::class);
        // Mail::fake(): los correos no se envían, se guardan para revisarlos en el test.
        Mail::fake();
    }

    private function makeCompanyUser(Company $company, string $role, string $email): User
    {
        $user = User::createWithRole([
            'first_name' => ucfirst($role), 'first_surname' => 'Prueba',
            'email' => $email, 'password' => 'secreto123',
        ], UserRole::COMPANY);

        $company->members()->create([
            'user_id' => $user->id,
            'company_role_id' => CompanyRole::where('name', $role)->firstOrFail()->id,
        ]);

        return $user;
    }

    private function makeCompany(string $name = 'Empresa S.A.'): array
    {
        $company = Company::create(['sector_id' => Sector::first()->id, 'name' => $name, 'contact_number' => '22901234']);
        $slug = strtolower(str_replace([' ', '.'], '', $name));

        return [
            $company,
            $this->makeCompanyUser($company, CompanyRole::OWNER, "owner@{$slug}.sv"),
            $this->makeCompanyUser($company, CompanyRole::RECRUITER, "recruiter@{$slug}.sv"),
        ];
    }

    /** Crea una invitación como owner y devuelve [respuesta, token en texto plano]. */
    private function invite(User $owner, array $body = []): array
    {
        Sanctum::actingAs($owner);
        $response = $this->postJson('/api/company/invitations', $body)->assertCreated();
        $token = basename($response->json('link'));

        return [$response, $token];
    }

    private function newAccount(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Rita', 'first_surname' => 'Reclutadora',
            'email' => 'rita@correo.sv', 'password' => 'secreto123', 'password_confirmation' => 'secreto123',
            'phone' => '7777-8888',
        ], $overrides);
    }

    // ---------- Acceso ----------

    public function test_only_owners_manage_invitations(): void
    {
        [, , $recruiter] = $this->makeCompany();

        $this->getJson('/api/company/invitations')->assertUnauthorized();

        Sanctum::actingAs($recruiter);
        $this->getJson('/api/company/invitations')->assertForbidden();
        $this->postJson('/api/company/invitations', [])->assertForbidden();
        $this->postJson('/api/company/onboarding')->assertForbidden();
    }

    // ---------- Crear ----------

    public function test_owner_creates_a_link_without_email(): void
    {
        [$company, $owner] = $this->makeCompany();

        [$response, $token] = $this->invite($owner);

        $response->assertJsonPath('invitation.status', 'pending')
            ->assertJsonPath('invitation.email', null)
            ->assertJsonPath('invitation.role', CompanyRole::RECRUITER)
            ->assertJsonPath('email_sent', false)
            ->assertJsonMissingPath('invitation.token');

        $this->assertStringStartsWith(config('app.frontend_url').'/invitacion/', $response->json('link'));

        // En la BD se guarda el hash, nunca el token en texto plano.
        $invitation = $company->invitations()->first();
        $this->assertNotSame($token, $invitation->token);
        $this->assertSame(hash('sha256', $token), $invitation->token);

        // Vence en 24 horas.
        $this->assertEqualsWithDelta(now()->addHours(24)->timestamp, $invitation->expires_at->timestamp, 5);

        Mail::assertNothingSent();
    }

    public function test_owner_invites_by_email_and_the_mail_carries_the_link(): void
    {
        [, $owner] = $this->makeCompany();

        [$response] = $this->invite($owner, ['email' => '  Rita@Correo.SV ']);
        $response->assertJsonPath('invitation.email', 'rita@correo.sv')->assertJsonPath('email_sent', true);

        $link = $response->json('link');
        Mail::assertSent(CompanyInvitationMail::class, fn ($mail) => $mail->hasTo('rita@correo.sv') && $mail->link === $link);
    }

    public function test_invite_email_validation(): void
    {
        [, $owner, $recruiter] = $this->makeCompany();
        $this->invite($owner, ['email' => 'rita@correo.sv']);

        // Ya hay una invitación pendiente para ese correo.
        $this->postJson('/api/company/invitations', ['email' => 'rita@correo.sv'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        // Ya existe una cuenta con ese correo.
        $this->postJson('/api/company/invitations', ['email' => $recruiter->email])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        // Formato inválido.
        $this->postJson('/api/company/invitations', ['email' => 'no-es-correo'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    // ---------- Listar y revocar ----------

    public function test_owner_lists_and_revokes_only_their_own_invitations(): void
    {
        [, $owner] = $this->makeCompany();
        [, $otherOwner] = $this->makeCompany('Otra S.A.');

        $this->invite($owner, ['email' => 'a@correo.sv']);
        $this->invite($owner);
        [$ajena] = $this->invite($otherOwner);

        Sanctum::actingAs($owner);
        $this->getJson('/api/company/invitations')->assertOk()->assertJsonCount(2, 'data');

        // La invitación de otra empresa responde 404 y no se borra.
        $this->deleteJson('/api/company/invitations/'.$ajena->json('invitation.id'))->assertNotFound();
        $this->assertDatabaseCount('company_invitations', 3);

        $mine = $this->getJson('/api/company/invitations')->json('data.0.id');
        $this->deleteJson("/api/company/invitations/{$mine}")->assertOk();
        $this->getJson('/api/company/invitations')->assertJsonCount(1, 'data');
    }

    // ---------- Ver y aceptar (público) ----------

    public function test_public_show_returns_company_data(): void
    {
        [, $owner] = $this->makeCompany();
        [, $token] = $this->invite($owner, ['email' => 'rita@correo.sv']);

        // Sin sesión: la ruta es pública.
        $this->app['auth']->forgetGuards();
        $this->getJson("/api/invitations/{$token}")
            ->assertOk()
            ->assertJsonPath('company.name', 'Empresa S.A.')
            ->assertJsonPath('email', 'rita@correo.sv')
            ->assertJsonPath('invited_by.first_name', 'Owner');

        $this->getJson('/api/invitations/token-que-no-existe')->assertNotFound();
    }

    public function test_accepting_creates_a_recruiter_account_with_session(): void
    {
        [$company, $owner] = $this->makeCompany();
        [, $token] = $this->invite($owner);
        $this->app['auth']->forgetGuards();

        $response = $this->postJson("/api/invitations/{$token}/accept", $this->newAccount())
            ->assertCreated()
            ->assertJsonStructure(['token', 'user'])
            ->assertJsonPath('user.role', UserRole::COMPANY)
            ->assertJsonPath('user.company_member.role', CompanyRole::RECRUITER)
            ->assertJsonPath('user.company_member.is_owner', false)
            ->assertJsonPath('user.company_member.phone', '77778888')
            ->assertJsonPath('user.company_member.company.id', $company->id);

        // El reclutador no ve la pantalla de bienvenida del owner.
        $this->assertNotNull($response->json('user.company_member.onboarded_at'));
        $this->assertNotNull($company->invitations()->first()->accepted_at);

        // El link ya no sirve: ni para verlo ni para crear otra cuenta.
        $this->getJson("/api/invitations/{$token}")->assertStatus(410);
        $this->postJson("/api/invitations/{$token}/accept", $this->newAccount(['email' => 'otra@correo.sv']))
            ->assertStatus(410);
        $this->assertSame(3, $company->members()->count()); // owner + recruiter inicial + Rita
    }

    public function test_email_bound_invitation_only_accepts_that_email(): void
    {
        [, $owner] = $this->makeCompany();
        [, $token] = $this->invite($owner, ['email' => 'rita@correo.sv']);
        $this->app['auth']->forgetGuards();

        $this->postJson("/api/invitations/{$token}/accept", $this->newAccount(['email' => 'intruso@correo.sv']))
            ->assertUnprocessable()->assertJsonValidationErrors('email');

        // Mayúsculas/espacios no importan: el correo se normaliza.
        $this->postJson("/api/invitations/{$token}/accept", $this->newAccount(['email' => 'RITA@correo.sv']))
            ->assertCreated();
    }

    public function test_expired_invitation_cannot_be_used(): void
    {
        [, $owner] = $this->makeCompany();
        [, $token] = $this->invite($owner);
        $this->app['auth']->forgetGuards();

        // travel(): adelanta el reloj de Laravel para simular que pasó el tiempo.
        $this->travel(CompanyInvitation::TTL_HOURS + 1)->hours();

        $this->getJson("/api/invitations/{$token}")->assertStatus(410);
        $this->postJson("/api/invitations/{$token}/accept", $this->newAccount())->assertStatus(410);
        $this->assertDatabaseMissing('users', ['email' => 'rita@correo.sv']);

        // Para el owner aparece como vencida.
        Sanctum::actingAs($owner);
        $this->getJson('/api/company/invitations')->assertJsonPath('data.0.status', 'expired');
    }

    public function test_accept_validation(): void
    {
        [, $owner, $recruiter] = $this->makeCompany();
        [, $token] = $this->invite($owner);
        $this->app['auth']->forgetGuards();

        $this->postJson("/api/invitations/{$token}/accept", $this->newAccount([
            'email' => $recruiter->email, 'password_confirmation' => 'otra', 'phone' => '123',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['email', 'password', 'phone']);

        // Un intento fallido no consume la invitación.
        $this->getJson("/api/invitations/{$token}")->assertOk();
    }

    // ---------- Onboarding del owner ----------

    public function test_owner_onboarding_is_marked_once(): void
    {
        [, $owner] = $this->makeCompany();
        Sanctum::actingAs($owner);

        $this->getJson('/api/auth/me')->assertJsonPath('user.company_member.onboarded_at', null);

        $first = $this->postJson('/api/company/onboarding')->assertOk()->json('onboarded_at');
        $this->travel(5)->minutes();
        $this->postJson('/api/company/onboarding')->assertJsonPath('onboarded_at', $first);
        $this->getJson('/api/auth/me')->assertJsonPath('user.company_member.onboarded_at', $first);
    }
}
