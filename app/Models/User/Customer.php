<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'user_customers';
    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }
}
