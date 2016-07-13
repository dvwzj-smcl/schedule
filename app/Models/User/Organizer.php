<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Organizer extends Model
{
    protected $table = 'sc_organizers';
    protected $fillable = ['user_id'];
    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }
}
