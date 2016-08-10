<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class DoctorSubCategory extends Model
{
    protected $table = 'sc_doctor_sub_categories';
    protected $fillable = ['sc_doctor_category_id', 'sc_sub_category_id', 'duration'];
    public $timestamps = false;

    public function sub_category(){
        return $this->belongsTo('App\Models\Calendar\SubCategory', 'sc_sub_category_id');
    }

//    public function name(){
//        return $this->belongsTo('App\Models\Calendar\SubCategory', 'sc_sub_category_id')->select(['name']);
//    }
}
