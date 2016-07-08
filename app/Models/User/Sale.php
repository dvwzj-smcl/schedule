<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'user_sales';
    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }

    public function events(){
        return $this->hasMany('App\Models\Calendar\Event');
    }
}
