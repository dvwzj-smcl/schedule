<?php

namespace App\Models\User;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function admin(){
        return $this->hasOne('App\Models\User\Admin');
    }
    public function customer(){
        return $this->hasOne('App\Models\User\Customer');
    }
    public function doctor(){
        return $this->hasOne('App\Models\User\Doctor');
    }
    public function middleman(){
        return $this->hasOne('App\Models\User\Middleman');
    }
    public function sale(){
        return $this->hasOne('App\Models\User\Sale');
    }

}
