<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    protected $table = 'calendar_sub_categories';

    public function category(){
        return $this->belongsTo('App\Models\Calendar\Category');
    }
    public function events(){
        return $this->hasManyThrough('App\Models\Calendar\Event', 'App\Models\Calendar\SubCategoryRegister');
    }
}
