<?php

namespace App\Models;

use App\Support\PublicImage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'role_id',
        'first_name',
        'second_name',
        'first_surname',
        'second_surname',
        'email',
        'password',
        'is_active',
        'avatar_path',
    ];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Crea un usuario con un rol (UserRole::STUDENT, COMPANY o ADMIN) a partir de datos ya
     * validados. Lo usan el registro y la aceptación de invitaciones.
     * La contraseña se guarda tal cual: el cast "hashed" la encripta al guardar.
     */
    public static function createWithRole(array $data, string $roleName): self
    {
        return self::create([
            'role_id' => UserRole::where('name', $roleName)->firstOrFail()->id,
            'first_name' => $data['first_name'],
            'second_name' => $data['second_name'] ?? null,
            'first_surname' => $data['first_surname'],
            'second_surname' => $data['second_surname'] ?? null,
            'email' => $data['email'],
            'password' => $data['password'],
        ]);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(UserRole::class);
    }

    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function companyMember(): HasOne
    {
        return $this->hasOne(CompanyMember::class);
    }

    /** URL pública de la foto de perfil, o null si no tiene. */
    public function avatarUrl(): ?string
    {
        return PublicImage::url($this->avatar_path);
    }
}