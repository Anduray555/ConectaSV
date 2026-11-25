<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\CompanyRole;
use App\Models\Sector;
use App\Models\User;
use App\Models\UserRole;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileImageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CatalogSeeder::class);
        // Disco falso: los archivos "existen" solo durante el test y se pueden inspeccionar.
        Storage::fake('public');
    }

    /**
     * PNG real de $width x $height, construido byte a byte.
     * UploadedFile::fake()->image() necesita la extensión GD de PHP, que no está instalada
     * en todas las PCs del proyecto; así los tests no dependen de ella.
     * Un PNG es: firma + bloque IHDR (tamaño) + bloque IDAT (píxeles comprimidos) + IEND.
     */
    private function png(string $name, int $width, int $height): UploadedFile
    {
        $chunk = fn (string $type, string $data) => pack('N', strlen($data)).$type.$data.pack('N', crc32($type.$data));

        // Cada fila empieza con un byte de "filtro" (0) seguido de RGB por píxel (gris).
        $pixels = str_repeat("\0".str_repeat("\x99\x99\x99", $width), $height);

        $bytes = "\x89PNG\r\n\x1a\n"
            .$chunk('IHDR', pack('NNCCCCC', $width, $height, 8, 2, 0, 0, 0))
            .$chunk('IDAT', gzcompress($pixels))
            .$chunk('IEND', '');

        return UploadedFile::fake()->createWithContent($name, $bytes);
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

    /** Crea una empresa con un owner y un recruiter. */
    private function makeCompany(): array
    {
        $company = Company::create(['sector_id' => Sector::first()->id, 'name' => 'Empresa S.A.', 'contact_number' => '22901234']);
        $members = [];
        foreach ([CompanyRole::OWNER, CompanyRole::RECRUITER] as $role) {
            $user = $this->makeUser(UserRole::COMPANY, "{$role}@empresa.sv");
            $company->members()->create([
                'user_id' => $user->id,
                'company_role_id' => CompanyRole::where('name', $role)->firstOrFail()->id,
                'phone' => '77778888',
            ]);
            $members[$role] = $user;
        }

        return [$company, $members[CompanyRole::OWNER], $members[CompanyRole::RECRUITER]];
    }

    // ---------- Foto de perfil ----------

    public function test_user_uploads_replaces_and_removes_avatar(): void
    {
        $user = $this->makeUser(UserRole::STUDENT, 'ana@ues.edu.sv');
        Sanctum::actingAs($user);

        $url = $this->postJson('/api/me/avatar', ['image' => $this->png('foto.png', 200, 200)])
            ->assertOk()
            ->json('avatar_url');

        $first = $user->fresh()->avatar_path;
        $this->assertStringStartsWith('avatars/', $first);
        $this->assertStringNotContainsString('foto', $first); // nombre aleatorio, no el original
        $this->assertStringEndsWith($first, $url);
        Storage::disk('public')->assertExists($first);

        // Reemplazar borra el archivo anterior.
        $this->postJson('/api/me/avatar', ['image' => $this->png('otra.jpg', 300, 300)])->assertOk();
        $second = $user->fresh()->avatar_path;
        $this->assertNotSame($first, $second);
        Storage::disk('public')->assertMissing($first);
        Storage::disk('public')->assertExists($second);

        // /auth/me la devuelve.
        $this->getJson('/api/auth/me')->assertJsonPath('user.avatar_url', Storage::disk('public')->url($second));

        // Quitarla borra el archivo y deja null.
        $this->deleteJson('/api/me/avatar')->assertOk()->assertJsonPath('avatar_url', null);
        Storage::disk('public')->assertMissing($second);
        $this->assertNull($user->fresh()->avatar_path);
    }

    public function test_avatar_requires_login(): void
    {
        $this->postJson('/api/me/avatar', ['image' => $this->png('foto.png', 200, 200)])
            ->assertUnauthorized();
    }

    public function test_image_validation(): void
    {
        Sanctum::actingAs($this->makeUser(UserRole::STUDENT, 'ana@ues.edu.sv'));

        $casos = [
            'sin archivo' => [],
            'pdf' => ['image' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf')],
            'svg' => ['image' => UploadedFile::fake()->create('logo.svg', 10, 'image/svg+xml')],
            'muy pesada' => ['image' => UploadedFile::fake()->create('grande.png', 3000, 'image/png')],
            'muy pequeña' => ['image' => $this->png('mini.png', 20, 20)],
        ];

        foreach ($casos as $caso => $datos) {
            $response = $this->postJson('/api/me/avatar', $datos);
            // El mensaje dice qué caso falló, porque los cinco comparten la misma aserción.
            $this->assertSame(422, $response->status(), "Caso: {$caso}");
            $this->assertArrayHasKey('image', $response->json('errors'), "Caso: {$caso}");
        }

        $this->assertEmpty(Storage::disk('public')->allFiles());
    }

    // ---------- Logo de empresa ----------

    public function test_owner_uploads_company_logo_and_it_shows_for_all_members(): void
    {
        [$company, $owner, $recruiter] = $this->makeCompany();

        Sanctum::actingAs($owner);
        $this->postJson('/api/company/logo', ['image' => $this->png('logo.png', 256, 256)])->assertOk();

        $path = $company->fresh()->logo_path;
        $this->assertStringStartsWith('logos/', $path);
        Storage::disk('public')->assertExists($path);

        $this->getJson('/api/auth/me')
            ->assertJsonPath('user.company_member.is_owner', true)
            ->assertJsonPath('user.company_member.company.logo_url', Storage::disk('public')->url($path));

        // El reclutador ve el mismo logo, pero no es owner.
        Sanctum::actingAs($recruiter);
        $this->getJson('/api/auth/me')
            ->assertJsonPath('user.company_member.is_owner', false)
            ->assertJsonPath('user.company_member.company.logo_url', Storage::disk('public')->url($path));

        Sanctum::actingAs($owner);
        $this->deleteJson('/api/company/logo')->assertOk();
        Storage::disk('public')->assertMissing($path);
        $this->assertNull($company->fresh()->logo_path);
    }

    public function test_only_the_owner_can_change_the_logo(): void
    {
        [, , $recruiter] = $this->makeCompany();
        $image = fn () => ['image' => $this->png('logo.png', 256, 256)];

        Sanctum::actingAs($recruiter);
        $this->postJson('/api/company/logo', $image())->assertForbidden();
        $this->deleteJson('/api/company/logo')->assertForbidden();

        Sanctum::actingAs($this->makeUser(UserRole::STUDENT, 'ana@ues.edu.sv'));
        $this->postJson('/api/company/logo', $image())->assertForbidden();

        $this->assertEmpty(Storage::disk('public')->allFiles());
    }
}
