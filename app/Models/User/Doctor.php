<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'user_doctors';
    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }

    public function events(){
        return $this->hasMany('App\Models\Calendar\Event');
    }
}