<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudentProfile extends Model
{
    protected $fillable = ['user_id', 'university_id', 'career_id', 'student_code'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class);
    }

    /** Tipos de oferta que le interesan (Trabajo, Práctica, Servicio Social). */
    public function interests(): BelongsToMany
    {
        return $this->belongsToMany(OfferType::class, 'student_interests');
    }
}
