<?php

namespace App\Models;

use App\Models\Business;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'id_user_create',
        'business_id',
        'time_in',
        'time_out'
    ];

    public function business() {
        return $this->belongsTo(Business::class, 'business_id');
    }

    // User who created this attendance record
    public function creator()
    {
        return $this->belongsTo(User::class, 'id_user_create');
    }
}
