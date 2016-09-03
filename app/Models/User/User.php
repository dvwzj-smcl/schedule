<?php

namespace App\Models\User;

use App\Models\Calendar\Category;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;
use BF;

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

    // local scope
    public function scopeCurrentBranch($query)
    {
        return $query->where('branch_id', \BF::getBranchId());
    }
    public function doctor(){
        return $this->hasOne('App\Models\User\Doctor');
    }
    public function roles(){
        return $this->belongsToMany('App\Models\User\Role');
    }
    public function branch()
    {
        return $this->belongsTo('App\Models\User\Branch');
    }
    public function roleUser() {
        return $this->belongsToMany('App\Models\User\Role','role_user');
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

    public function getAllRoles(){
        $roles = [];
        foreach ($this->roles as $role) {
            $roles[] = $role->name;
        }
        return $roles;
    }

    public function scopeSales($query) {
        $query->join('role_user', function ($join) {
            $join->on('users.id', '=', 'role_user.user_id');
        })->join('roles', function($join) {
            $join->on('roles.id', '=', 'role_user.role_id')->where('roles.name', '=', 'sale');
        });
    }

    public function checkAndCreateDoctor()
    {
        if($this->hasRole('doctor')) {
            // Create only not exist
            if(Doctor::where('user_id', $this->id)->count() == 0) {
                $doctorData = ['categories'=>[]];
                $categories = Category::all();
                foreach($categories as $cat) {
                    $sub_categories = [];
                    foreach ($cat->sub_categories as $sub) {
                        $sub_categories[$sub->id] = [
                            'category_id' => $cat->id,
                            'sub_category_id' => $sub->id,
                            'duration' => $sub->duration,
                            'enable' => false,
                        ];
                    }
                    $doctorData['categories'][$cat->id] = [
                        'color' => $cat->color,
                        'sub_categories' => $sub_categories
                    ];
                }
                Doctor::create(['color' => BF::getRandomColor(), 'data' => json_encode($doctorData), 'user_id' => $this->id]);
            }
        }
    }

}