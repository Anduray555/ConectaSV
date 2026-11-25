<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TagCategory extends Model
{
    protected $fillable = ['name', 'slug'];

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }

    /** Áreas a las que aplica. Si no tiene ninguna, es una categoría general. */
    public function studyAreas(): BelongsToMany
    {
        return $this->belongsToMany(StudyArea::class);
    }
}
