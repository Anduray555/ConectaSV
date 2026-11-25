<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudyArea extends Model
{
    protected $fillable = ['name', 'slug'];

    public function careers(): HasMany
    {
        return $this->hasMany(Career::class);
    }

    /** Categorías de tags propias de esta área (pivote study_area_tag_category). */
    public function tagCategories(): BelongsToMany
    {
        return $this->belongsToMany(TagCategory::class);
    }
}
