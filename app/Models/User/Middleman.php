<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Middleman extends Model
{
    protected $table = 'user_middlemen';
    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }
}
