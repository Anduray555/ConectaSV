<?php

namespace Tests\Feature;

use App\Models\Career;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserRole;
use Database\Seeders\CareerSeeder;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\StudyAreaSeeder;
use Database\Seeders\TagCategorySeeder;
use Database\Seeders\TagSeeder;
use Database\Seeders\UniversitySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StudentTagTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            CatalogSeeder::class, UniversitySeeder::class, StudyAreaSeeder::class, CareerSeeder::class,
            TagCategorySeeder::class, TagSeeder::class,
        ]);
    }

    private function makeUser(string $role, string $email): User
    {
        return User::create([
            'role_id' => UserRole::where('name', $role)->firstOrFail()->id,
            'first_name' => 'Prueba',
            'first_surname' => 'Usuario',
            'email' => $email,
            'password' => 'secreto123',
        ]);
    }

    private function makeStudent(string $email = 'ana@ues.edu.sv'): User
    {
        $user = $this->makeUser(UserRole::STUDENT, $email);
        $career = Career::first();
        $user->studentProfile()->create([
            'university_id' => $career->university_id,
            'career_id' => $career->id,
            'student_code' => 'AA00001',
        ]);

        return $user;
    }

    private function tagIds(int $count): array
    {
        return Tag::orderBy('id')->limit($count)->pluck('id')->all();
    }

    // ---------- Catálogo público ----------

    public function test_tag_catalog_is_public_and_matches_the_seed_file(): void
    {
        $response = $this->getJson('/api/tags')->assertOk();

        // Los totales salen del mismo archivo que usan los seeders: si el catálogo cambia,
        // el test no hay que tocarlo.
        $catalog = TagCategorySeeder::catalog()['categories'];
        $response->assertJsonCount(count($catalog))
            ->assertJsonStructure([[
                'id', 'name', 'slug', 'is_general', 'matches_career',
                'tags' => [['id', 'name', 'slug', 'category_id']],
            ]]);

        $total = collect($response->json())->sum(fn ($category) => count($category['tags']));
        $this->assertSame(collect($catalog)->sum(fn ($c) => count($c['tags'])), $total);

        // Sin carrera: ninguna coincide, y las generales van primero.
        $this->assertFalse(collect($response->json())->contains('matches_career', true));
        $this->assertTrue($response->json('0.is_general'));
    }

    public function test_career_puts_its_area_categories_first_then_general(): void
    {
        $sistemas = Career::where('name', 'Ingeniería de Sistemas Informáticos')->firstOrFail();

        $categories = collect($this->getJson("/api/tags?career_id={$sistemas->id}")->assertOk()->json());

        // Grupo de cada categoría en el orden recibido: 0 = de su área, 1 = general, 2 = otras.
        $groups = $categories->map(fn ($c) => $c['matches_career'] ? 0 : ($c['is_general'] ? 1 : 2));
        $this->assertSame($groups->sort()->values()->all(), $groups->values()->all(), 'El orden no respeta los grupos');

        $mine = $categories->where('matches_career', true)->pluck('name');
        $this->assertContains('Frontend', $mine);
        $this->assertContains('Gestión de proyectos', $mine); // compartida con Ingeniería y Negocios
        $this->assertNotContains('Ramas del derecho', $mine);

        // Una categoría compartida también aparece para otra área.
        $derecho = Career::where('name', 'Licenciatura en Ciencias Jurídicas')->firstOrFail();
        $mineDerecho = collect($this->getJson("/api/tags?career_id={$derecho->id}")->json())
            ->where('matches_career', true)->pluck('name');
        $this->assertEqualsCanonicalizing(['Ramas del derecho', 'Práctica jurídica'], $mineDerecho->all());
    }

    public function test_invalid_career_id_is_rejected(): void
    {
        $this->getJson('/api/tags?career_id=999999')->assertUnprocessable()->assertJsonValidationErrors('career_id');
    }

    // ---------- Acceso ----------

    public function test_student_tag_routes_require_a_student(): void
    {
        $this->getJson('/api/student/tags')->assertUnauthorized();

        Sanctum::actingAs($this->makeUser(UserRole::COMPANY, 'rrhh@empresa.sv'));
        $this->getJson('/api/student/tags')->assertForbidden();
        $this->putJson('/api/student/tags', ['tag_ids' => []])->assertForbidden();
        $this->postJson('/api/student/onboarding')->assertForbidden();
    }

    // ---------- Guardar tags ----------

    public function test_student_syncs_tags(): void
    {
        $student = $this->makeStudent();
        Sanctum::actingAs($student);

        $this->putJson('/api/student/tags', ['tag_ids' => $this->tagIds(3)])
            ->assertOk()
            ->assertJsonCount(3, 'data');

        // sync reemplaza la lista: ahora solo queda uno.
        $this->putJson('/api/student/tags', ['tag_ids' => $this->tagIds(1)])
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/student/tags')->assertOk()->assertJsonCount(1, 'data');
        $this->assertSame($this->tagIds(1), $student->studentProfile->tags()->pluck('tags.id')->all());
    }

    public function test_empty_list_removes_all_tags(): void
    {
        $student = $this->makeStudent();
        $student->studentProfile->tags()->sync($this->tagIds(2));
        Sanctum::actingAs($student);

        $this->putJson('/api/student/tags', ['tag_ids' => []])->assertOk()->assertJsonCount(0, 'data');
        $this->assertSame(0, $student->studentProfile->tags()->count());
    }

    public function test_tag_validation(): void
    {
        Sanctum::actingAs($this->makeStudent());

        // Falta la clave.
        $this->putJson('/api/student/tags', [])->assertUnprocessable()->assertJsonValidationErrors('tag_ids');
        // Más de 10.
        $this->putJson('/api/student/tags', ['tag_ids' => $this->tagIds(11)])
            ->assertUnprocessable()->assertJsonValidationErrors('tag_ids');
        // Id inexistente.
        $this->putJson('/api/student/tags', ['tag_ids' => [999999]])
            ->assertUnprocessable()->assertJsonValidationErrors('tag_ids.0');
        // Repetidos.
        $id = $this->tagIds(1)[0];
        $this->putJson('/api/student/tags', ['tag_ids' => [$id, $id]])
            ->assertUnprocessable()->assertJsonValidationErrors('tag_ids.0');
    }

    // ---------- Onboarding y /auth/me ----------

    public function test_onboarding_is_marked_once_and_shown_in_me(): void
    {
        $student = $this->makeStudent();
        $student->studentProfile->tags()->sync($this->tagIds(2));
        Sanctum::actingAs($student);

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.student_profile.onboarded_at', null)
            ->assertJsonCount(2, 'user.student_profile.tags');

        $first = $this->postJson('/api/student/onboarding')->assertOk()->json('onboarded_at');
        $this->assertNotNull($first);

        // Una segunda llamada conserva la primera fecha.
        $this->travel(5)->minutes();
        $this->postJson('/api/student/onboarding')->assertOk()->assertJsonPath('onboarded_at', $first);

        $this->getJson('/api/auth/me')->assertJsonPath('user.student_profile.onboarded_at', $first);
    }
}
