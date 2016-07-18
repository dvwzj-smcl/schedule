<?php

namespace App\Models\User;

use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission
{
    public function roles(){
        return $this->belongsToMany('App\Models\User\Role');
    }
    //
}
