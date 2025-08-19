<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\User;

class Business extends Model
{
    protected $fillable = [
        'business_name',
        'image',
        'user_id',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'business_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'business_id');
    }
}
