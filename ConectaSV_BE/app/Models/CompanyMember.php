<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyMember extends Model
{
    protected $fillable = ['company_id', 'user_id', 'company_role_id', 'phone', 'onboarded_at'];

    protected function casts(): array
    {
        return ['onboarded_at' => 'datetime'];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function companyRole(): BelongsTo
    {
        return $this->belongsTo(CompanyRole::class);
    }

    public function isOwner(): bool
    {
        return $this->companyRole?->name === CompanyRole::OWNER;
    }
}