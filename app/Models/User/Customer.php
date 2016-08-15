<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'sc_customers';
    protected $guarded = ['id', 'created_at', 'updated_at'];
}
