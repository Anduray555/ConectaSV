<?php

namespace Tests\Feature;

use App\Models\Career;
use App\Models\OfferType;
use App\Models\Sector;
use App\Models\User;
use Database\Seeders\CareerSeeder;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\UniversitySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([CatalogSeeder::class, UniversitySeeder::class, CareerSeeder::class]);
    }

    private function studentPayload(array $overrides = []): array
    {
        $career = Career::first();

        return array_merge([
            'first_name' => 'Andrea',
            'second_name' => 'Guadalupe',
            'first_surname' => 'Martínez',
            'second_surname' => 'López',
            'email' => 'Andrea@UES.edu.sv',
            'password' => 'secreto123',
            'password_confirmation' => 'secreto123',
            'university_id' => $career->university_id,
            'career_id' => $career->id,
            'student_code' => 'ml21001',
            'interests' => OfferType::pluck('id')->take(2)->all(),
        ], $overrides);
    }

    private function companyPayload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'María',
            'first_surname' => 'González',
            'email' => 'rrhh@empresa.com.sv',
            'password' => 'secreto123',
            'password_confirmation' => 'secreto123',
            'company_name' => 'Empresa S.A.',
            'sector_id' => Sector::first()->id,
            'web_site' => 'www.empresa.com.sv',
            'contact_number' => '2290-1234',
        ], $overrides);
    }

    public function test_student_registers_and_receives_session(): void
    {
        $response = $this->postJson('/api/auth/register/student', $this->studentPayload());

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'role', 'student_profile' => ['interests']]])
            ->assertJsonPath('user.role', 'student')
            ->assertJsonPath('user.email', 'andrea@ues.edu.sv')
            ->assertJsonPath('user.student_profile.student_code', 'ML21001')
            ->assertJsonCount(2, 'user.student_profile.interests');

        $this->withToken($response->json('token'))
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'andrea@ues.edu.sv');
    }

    public function test_student_requires_at_least_one_interest(): void
    {
        $this->postJson('/api/auth/register/student', $this->studentPayload(['interests' => []]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('interests');
    }

    public function test_student_career_must_belong_to_university(): void
    {
        $other = Career::where('university_id', '!=', Career::first()->university_id)->first();
        $this->assertNotNull($other, 'Se necesitan carreras de al menos dos universidades.');

        $this->postJson('/api/auth/register/student', $this->studentPayload(['career_id' => $other->id]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('career_id');
    }

    public function test_student_code_is_unique_per_university(): void
    {
        $this->postJson('/api/auth/register/student', $this->studentPayload())->assertCreated();

        $this->postJson('/api/auth/register/student', $this->studentPayload([
            'email' => 'otra@ues.edu.sv',
        ]))->assertUnprocessable()->assertJsonValidationErrors('student_code');
    }

    public function test_email_must_be_unique_and_passwords_match(): void
    {
        $this->postJson('/api/auth/register/student', $this->studentPayload())->assertCreated();

        $this->postJson('/api/auth/register/company', $this->companyPayload([
            'email' => 'andrea@ues.edu.sv',
            'password_confirmation' => 'diferente',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_company_registers_with_normalized_phone_and_website(): void
    {
        $this->postJson('/api/auth/register/company', $this->companyPayload())
            ->assertCreated()
            ->assertJsonPath('user.role', 'company')
            ->assertJsonPath('user.company_member.role', 'owner')
            ->assertJsonPath('user.company_member.phone', null)
            ->assertJsonPath('user.company_member.company.contact_number', '22901234')
            ->assertJsonPath('user.company_member.company.web_site', 'https://www.empresa.com.sv');
    }

    public function test_login_and_logout(): void
    {
        $this->postJson('/api/auth/register/student', $this->studentPayload())->assertCreated();

        $this->postJson('/api/auth/login', ['email' => 'andrea@ues.edu.sv', 'password' => 'incorrecta'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $token = $this->postJson('/api/auth/login', ['email' => 'andrea@ues.edu.sv', 'password' => 'secreto123'])
            ->assertOk()
            ->json('token');

        $this->assertSame(2, User::first()->tokens()->count()); // registro + login

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        // Solo se borra el token de la sesión que cerró.
        $this->assertSame(1, User::first()->tokens()->count());
    }

    public function test_offer_types_catalog(): void
    {
        $this->getJson('/api/offer-types')
            ->assertOk()
            ->assertJsonCount(3);
    }
}
