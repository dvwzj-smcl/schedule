<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'user_admins';
    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }
}
