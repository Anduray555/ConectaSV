<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = ['sector_id', 'name', 'web_site', 'contact_number'];

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(CompanyMember::class);
    }
}