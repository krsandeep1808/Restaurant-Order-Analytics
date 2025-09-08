<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'restaurant_id', 'order_date', 'order_time', 'amount', 'status'
    ];

    protected $casts = [
        'order_date' => 'date',
        'amount' => 'decimal:2'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}