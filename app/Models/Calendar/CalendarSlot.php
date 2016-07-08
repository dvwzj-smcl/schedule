<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class CalendarSlot extends Model
{
    public function sub_category(){
        return $this->belongsTo('App\Models\Calendar\SubCategory');
    }
    public function doctor(){
        return $this->belongsTo('App\Models\User\Doctor');
    }
    public function middleman(){
        return $this->belongsTo('App\Models\User\Middleman');
    }
    public function events(){
        return $this->hasMany('App\Models\Calendar\Event');
    }
}
