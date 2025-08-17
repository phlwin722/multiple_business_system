<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bussines extends Model
{
    protected $fillable = [
        'business_name',
        'image',
        'user_id',
    ];
}
