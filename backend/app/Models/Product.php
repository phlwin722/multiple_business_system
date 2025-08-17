<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'id',
        'product_name',
        'price',
        'quantity',
        'image',
        'business_id',
        'user_id'
    ];
}
