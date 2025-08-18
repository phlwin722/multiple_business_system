<?php

namespace App\Models;
use App\Models\Bussines;
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
        return $this->belongsTo(Bussines::class, 'business_id');
    }
}
