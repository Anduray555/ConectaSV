<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\CompanyRole;
use App\Models\Sector;
use App\Models\User;
use App\Models\UserRole;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CompanyMemberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CatalogSeeder::class);
    }

    private function addMember(Company $company, string $role, string $email): User
    {
        $user = User::createWithRole([
            'first_name' => ucfirst(strtok($email, '@')), 'first_surname' => 'Prueba',
            'email' => $email, 'password' => 'secreto123',
        ], UserRole::COMPANY);

        $company->members()->create([
            'user_id' => $user->id,
            'company_role_id' => CompanyRole::where('name', $role)->firstOrFail()->id,
        ]);

        return $user;
    }

    private function makeCompany(string $slug = 'empresa'): array
    {
        $company = Company::create(['sector_id' => Sector::first()->id, 'name' => ucfirst($slug), 'contact_number' => '22901234']);

        // El reclutador se crea ANTES que el owner para comprobar que el owner igual va primero.
        $recruiter = $this->addMember($company, CompanyRole::RECRUITER, "rita@{$slug}.sv");
        $owner = $this->addMember($company, CompanyRole::OWNER, "olga@{$slug}.sv");

        return [$company, $owner, $recruiter];
    }

    public function test_only_owners_see_members(): void
    {
        [, , $recruiter] = $this->makeCompany();

        $this->getJson('/api/company/members')->assertUnauthorized();

        Sanctum::actingAs($recruiter);
        $this->getJson('/api/company/members')->assertForbidden();
    }

    public function test_owner_lists_members_with_owner_first(): void
    {
        [, $owner] = $this->makeCompany();
        $this->makeCompany('otra'); // otra empresa: sus miembros no deben aparecer

        Sanctum::actingAs($owner);
        $this->getJson('/api/company/members')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.email', 'olga@empresa.sv')
            ->assertJsonPath('data.0.is_owner', true)
            ->assertJsonPath('data.1.email', 'rita@empresa.sv')
            ->assertJsonPath('data.1.role', CompanyRole::RECRUITER)
            ->assertJsonPath('data.1.is_active', true);
    }

    public function test_owner_deactivates_and_reactivates_a_recruiter(): void
    {
        [$company, $owner, $recruiter] = $this->makeCompany();
        $recruiter->createToken('api');
        $memberId = $company->members()->where('user_id', $recruiter->id)->value('id');

        Sanctum::actingAs($owner);
        $this->patchJson("/api/company/members/{$memberId}/status", ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        // Se cierran sus sesiones y ya no puede iniciar sesión.
        $this->assertSame(0, $recruiter->tokens()->count());
        $this->app['auth']->forgetGuards();
        $this->postJson('/api/auth/login', ['email' => $recruiter->email, 'password' => 'secreto123'])
            ->assertForbidden();

        // Sigue siendo miembro: sus datos se conservan.
        $this->assertDatabaseHas('company_members', ['id' => $memberId]);

        Sanctum::actingAs($owner);
        $this->patchJson("/api/company/members/{$memberId}/status", ['is_active' => true])
            ->assertOk()
            ->assertJsonPath('data.is_active', true);
        $this->assertTrue($recruiter->fresh()->is_active);
    }

    public function test_owner_cannot_be_deactivated_and_other_companies_are_hidden(): void
    {
        [$company, $owner] = $this->makeCompany();
        [$otra] = $this->makeCompany('otra');

        Sanctum::actingAs($owner);

        $ownerMemberId = $company->members()->where('user_id', $owner->id)->value('id');
        $this->patchJson("/api/company/members/{$ownerMemberId}/status", ['is_active' => false])
            ->assertUnprocessable();
        $this->assertTrue($owner->fresh()->is_active);

        $ajeno = $otra->members()->first();
        $this->patchJson("/api/company/members/{$ajeno->id}/status", ['is_active' => false])->assertNotFound();
        $this->assertTrue($ajeno->user->fresh()->is_active);

        $this->patchJson("/api/company/members/{$ajeno->id}/status", [])->assertUnprocessable();
    }
}
