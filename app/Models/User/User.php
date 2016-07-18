<?php

namespace App\Models\User;

use App\Models\Updater;
use Illuminate\Database\Eloquent\SoftDeletes;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;
use DB;

class User extends Authenticatable
{
    use EntrustUserTrait;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'remember_token',
        'branch_id',
        'phone',
        'phone_2',
        'lang',
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
    public function roles(){
        return $this->belongsToMany('App\Models\User\Role');
    }
    public function getAllPermissions(){
        $perms = [];
        $roles = $this->roles;
        foreach ($roles as $role) {
            $permissions = $role->permissions;
            foreach ($permissions as $permission) {
                $perms[] = $permission->name;
            }
        }
        return $perms;
    }

}