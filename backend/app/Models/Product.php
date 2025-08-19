<?php

namespace App\Models;
use App\Models\Business;
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
        'user_id',
        'image'
    ];

    public function business() {
        return $this->belongsTo(Business::class, 'business_id');
    }
}
