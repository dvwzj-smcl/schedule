<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'sc_doctors';
    protected $fillable = ['color', 'user_id'];

    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }
    public function categories(){
        return $this->hasMany('App\Models\Calendar\DoctorCategory', 'sc_doctor_id');
    }
    public function sub_categories(){
        return $this->hasMany('App\Models\Calendar\DoctorSubCategory', 'sc_doctor_id');
    }
}
