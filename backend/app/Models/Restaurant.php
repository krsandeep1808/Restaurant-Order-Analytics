<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'id', 'name', 'cuisine', 'address', 'city', 'rating', 'is_active'
    ];

    protected $casts = [
        'rating' => 'float',
        'is_active' => 'boolean'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}