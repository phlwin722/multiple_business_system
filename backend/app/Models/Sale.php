<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Sale extends Model
{
    protected $fillable = [
        'order_quantity',
        'price',
        'product_id',
        'payment_mode',
        'business_id',
        'user_id'
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
