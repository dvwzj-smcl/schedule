<?php

namespace App\Models\User;

use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use EntrustUserTrait;
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

    public function doctor(){
        return $this->hasOne('App\Models\User\Doctor');
    }
    public function organizer(){
        return $this->hasOne('App\Models\User\Organizer');
    }
    public function sale(){
        return $this->hasOne('App\Models\User\Sale');
    }

}