<?php

namespace App\Models;

use App\Support\PublicImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = ['sector_id', 'name', 'web_site', 'contact_number', 'logo_path'];

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(CompanyMember::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(CompanyInvitation::class);
    }

    /** URL pública del logo, o null si no tiene. */
    public function logoUrl(): ?string
    {
        return PublicImage::url($this->logo_path);
    }
}
