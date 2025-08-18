<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
class Bussines extends Model
{
    protected $fillable = [
        'business_name',
        'image',
        'user_id',
    ];

    public function products () {
        return $this->hasMany(Product::class, 'business_id');
    }
}
