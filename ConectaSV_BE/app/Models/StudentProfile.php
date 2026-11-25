<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudentProfile extends Model
{
    protected $fillable = ['user_id', 'university_id', 'career_id', 'student_code', 'onboarded_at'];

    protected function casts(): array
    {
        // Convierte el texto de la BD en un objeto de fecha (Carbon) y viceversa.
        return ['onboarded_at' => 'datetime'];
    }

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

    /** Tags del estudiante. La tabla student_profile_tag sigue la convención, no hace falta nombrarla. */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
