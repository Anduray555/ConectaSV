<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = ['tag_category_id', 'name', 'slug'];

    public function category(): BelongsTo
    {
        // El método se llama "category", así que Laravel buscaría "category_id":
        // por eso indicamos la columna real.
        return $this->belongsTo(TagCategory::class, 'tag_category_id');
    }

    public function studentProfiles(): BelongsToMany
    {
        return $this->belongsToMany(StudentProfile::class);
    }
}
