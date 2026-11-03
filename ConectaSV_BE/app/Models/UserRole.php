<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRole extends Model
{
    public const STUDENT = 'student';
    public const COMPANY = 'company';
    public const ADMIN = 'admin';

    protected $fillable = ['name'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }
}
