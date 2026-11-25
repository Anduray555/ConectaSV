<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CompanyInvitation extends Model
{
    /** Cuánto dura una invitación desde que se crea. */
    public const TTL_HOURS = 24;

    protected $fillable = ['company_id', 'invited_by', 'email', 'token', 'company_role_id', 'expires_at', 'accepted_at'];

    // El hash del token nunca sale en las respuestas JSON.
    protected $hidden = ['token'];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'accepted_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /** Miembro que creó la invitación (columna invited_by). */
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(CompanyMember::class, 'invited_by');
    }

    public function companyRole(): BelongsTo
    {
        return $this->belongsTo(CompanyRole::class);
    }

    // ---------- Token ----------

    /**
     * Genera un token aleatorio. Devuelve [token en texto plano, hash].
     * El texto plano va en el link (solo se conoce en este momento); en la BD se guarda el hash.
     */
    public static function newToken(): array
    {
        $plain = Str::random(48);

        return [$plain, self::hashToken($plain)];
    }

    public static function hashToken(string $plain): string
    {
        return hash('sha256', $plain);
    }

    /** Busca la invitación que corresponde a un token recibido en el link. */
    public static function findByToken(string $plain): ?self
    {
        return self::where('token', self::hashToken($plain))->first();
    }

    // ---------- Estado ----------

    public function isAccepted(): bool
    {
        return $this->accepted_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /** Se puede usar si no se aceptó y no venció. */
    public function isUsable(): bool
    {
        return ! $this->isAccepted() && ! $this->isExpired();
    }

    /** "pending" | "expired" | "accepted", para mostrarlo en la interfaz. */
    public function status(): string
    {
        return match (true) {
            $this->isAccepted() => 'accepted',
            $this->isExpired() => 'expired',
            default => 'pending',
        };
    }

    /** Scope: Invitation::pending() = no aceptadas y sin vencer. */
    public function scopePending(Builder $query): Builder
    {
        return $query->whereNull('accepted_at')->where('expires_at', '>', now());
    }

    /** Link que se comparte: apunta al FRONTEND, que muestra la pantalla de registro. */
    public static function linkFor(string $plainToken): string
    {
        return rtrim(config('app.frontend_url'), '/').'/invitacion/'.$plainToken;
    }
}
