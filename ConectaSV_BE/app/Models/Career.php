<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Career extends Model
{
    protected $fillable = ['university_id', 'study_area_id', 'name'];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function studyArea(): BelongsTo
    {
        return $this->belongsTo(StudyArea::class);
    }

    public function studentProfiles(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }
}