<?php

namespace Tests\Feature;

use App\Models\Career;
use App\Models\Company;
use App\Models\CompanyRole;
use App\Models\Sector;
use App\Models\User;
use App\Models\UserRole;
use Database\Seeders\CareerSeeder;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\UniversitySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([CatalogSeeder::class, UniversitySeeder::class, CareerSeeder::class]);
    }

    private function makeUser(string $role, string $email, array $attributes = []): User
    {
        return User::create(array_merge([
            'role_id' => UserRole::where('name', $role)->firstOrFail()->id,
            'first_name' => ucfirst(strtok($email, '@')),
            'first_surname' => 'Prueba',
            'email' => $email,
            'password' => 'secreto123',
        ], $attributes));
    }

    private function makeStudent(string $email, array $attributes = []): User
    {
        $user = $this->makeUser(UserRole::STUDENT, $email, $attributes);
        $career = Career::first();
        $user->studentProfile()->create([
            'university_id' => $career->university_id,
            'career_id' => $career->id,
            'student_code' => strtoupper(substr(md5($email), 0, 8)),
        ]);

        return $user;
    }

    private function makeCompanyUser(string $email, string $companyName): User
    {
        $user = $this->makeUser(UserRole::COMPANY, $email);
        $company = Company::create(['sector_id' => Sector::first()->id, 'name' => $companyName, 'contact_number' => '22901234']);
        $company->members()->create([
            'user_id' => $user->id,
            'company_role_id' => CompanyRole::where('name', CompanyRole::OWNER)->firstOrFail()->id,
        ]);

        return $user;
    }

    private function adminToken(): string
    {
        return $this->makeUser(UserRole::ADMIN, 'admin@conectasv.sv')->createToken('api')->plainTextToken;
    }

    public function test_only_admins_can_use_admin_routes(): void
    {
        $student = $this->makeStudent('ana@ues.edu.sv');
        $token = $student->createToken('api')->plainTextToken;

        $this->getJson('/api/admin/users')->assertUnauthorized();
        $this->withToken($token)->getJson('/api/admin/users')->assertForbidden();
        $this->withToken($token)->getJson('/api/admin/summary')->assertForbidden();
        $this->withToken($token)->patchJson("/api/admin/users/{$student->id}/status", ['is_active' => false])->assertForbidden();
    }

    public function test_lists_students_and_companies_but_not_admins(): void
    {
        $token = $this->adminToken();
        $this->makeStudent('ana@ues.edu.sv');
        $this->makeCompanyUser('rh@acme.sv', 'ACME S.A.');

        $response = $this->withToken($token)->getJson('/api/admin/users')->assertOk();

        $response->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonMissing(['email' => 'admin@conectasv.sv']);

        $company = collect($response->json('data'))->firstWhere('email', 'rh@acme.sv');
        $this->assertSame('company', $company['role']);
        $this->assertSame('ACME S.A.', $company['detail']);
    }

    public function test_filters_by_role_status_and_search(): void
    {
        $token = $this->adminToken();
        $this->makeStudent('ana@ues.edu.sv');
        $this->makeStudent('beto@uca.edu.sv', ['is_active' => false]);
        $this->makeCompanyUser('rh@acme.sv', 'ACME S.A.');

        $emails = fn (string $query) => collect($this->withToken($token)->getJson("/api/admin/users?{$query}")->assertOk()->json('data'))
            ->pluck('email')->sort()->values()->all();

        $this->assertSame(['ana@ues.edu.sv', 'beto@uca.edu.sv'], $emails('role=student'));
        $this->assertSame(['beto@uca.edu.sv'], $emails('status=suspended'));
        $this->assertSame(['ana@ues.edu.sv'], $emails('role=student&status=active'));
        $this->assertSame(['rh@acme.sv'], $emails('search=acme'));   // nombre de la empresa
        $this->assertSame(['beto@uca.edu.sv'], $emails('search=BETO')); // sin distinguir mayúsculas

        $this->withToken($token)->getJson('/api/admin/users?role=admin')->assertUnprocessable();
    }

    public function test_paginates_results(): void
    {
        $token = $this->adminToken();
        foreach (range(1, 3) as $i) {
            $this->makeStudent("estudiante{$i}@ues.edu.sv");
        }

        $this->withToken($token)->getJson('/api/admin/users?per_page=2&page=2')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.total', 3);
    }

    public function test_suspending_blocks_login_and_closes_open_sessions(): void
    {
        $token = $this->adminToken();
        $student = $this->makeStudent('ana@ues.edu.sv');
        $studentToken = $student->createToken('api')->plainTextToken;

        $this->withToken($studentToken)->getJson('/api/auth/me')->assertOk();
        $this->app['auth']->forgetGuards(); // En pruebas el guard recuerda al usuario anterior.

        $this->withToken($token)->patchJson("/api/admin/users/{$student->id}/status", ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        $this->assertSame(0, $student->tokens()->count());
        $this->app['auth']->forgetGuards(); // Que la siguiente petición vuelva a leer el token.
        $this->withToken($studentToken)->getJson('/api/auth/me')->assertUnauthorized();

        $this->postJson('/api/auth/login', ['email' => 'ana@ues.edu.sv', 'password' => 'secreto123'])
            ->assertForbidden();
    }

    public function test_reactivating_allows_login_again(): void
    {
        $token = $this->adminToken();
        $student = $this->makeStudent('ana@ues.edu.sv', ['is_active' => false]);

        $this->withToken($token)->patchJson("/api/admin/users/{$student->id}/status", ['is_active' => true])
            ->assertOk()
            ->assertJsonPath('data.is_active', true);

        $this->app['auth']->forgetGuards();
        $this->postJson('/api/auth/login', ['email' => 'ana@ues.edu.sv', 'password' => 'secreto123'])->assertOk();
    }

    public function test_admin_accounts_cannot_be_modified(): void
    {
        $token = $this->adminToken();
        $admin = User::where('email', 'admin@conectasv.sv')->first();
        $other = $this->makeUser(UserRole::ADMIN, 'otro@conectasv.sv');

        $this->withToken($token)->patchJson("/api/admin/users/{$admin->id}/status", ['is_active' => false])->assertForbidden();
        $this->withToken($token)->patchJson("/api/admin/users/{$other->id}/status", ['is_active' => false])->assertForbidden();
        $this->assertTrue($admin->fresh()->is_active);
        $this->assertTrue($other->fresh()->is_active);
    }

    public function test_status_requires_a_boolean(): void
    {
        $token = $this->adminToken();
        $student = $this->makeStudent('ana@ues.edu.sv');

        $this->withToken($token)->patchJson("/api/admin/users/{$student->id}/status", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('is_active');
        $this->withToken($token)->patchJson('/api/admin/users/9999/status', ['is_active' => false])->assertNotFound();
    }

    public function test_summary_counts(): void
    {
        $token = $this->adminToken();
        $this->makeStudent('ana@ues.edu.sv');
        $this->makeStudent('beto@uca.edu.sv', ['is_active' => false]);
        $this->makeCompanyUser('rh@acme.sv', 'ACME S.A.');

        $this->withToken($token)->getJson('/api/admin/summary')
            ->assertOk()
            ->assertJsonPath('users', 3)
            ->assertJsonPath('students', 2)
            ->assertJsonPath('active_students', 1)
            ->assertJsonPath('universities', 1)
            ->assertJsonPath('companies', 1)
            ->assertJsonPath('suspended', 1)
            ->assertJsonCount(3, 'recent');
    }
}
