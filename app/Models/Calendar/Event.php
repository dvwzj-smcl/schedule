<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'calendar_events';

    public function customer(){
        return $this->belongsTo('App\Models\User\Customer');
    }
    public function sale(){
        return $this->belongsTo('App\Models\User\Sale');
    }
    public function register(){
        return $this->belongsTo('App\Models\Calendar\SubCategoryRegister');
    }
}
