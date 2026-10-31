<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\eloquent\Relations\HasMany;

class CompanyRole extends Model
{
    protected $fillable = ['name'];

    public function companyMembers(): HasMany
    {
        return $this->hasMany(CompanyMember::class);
    }
}
