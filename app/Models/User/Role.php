<?php

namespace App\Models\User;

use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole
{
    public function permissions(){
        return $this->belongsToMany('App\Models\User\Permission');
    }

    public function users() {
        return $this->belongsToMany('App\Models\User\User');
    }
}
