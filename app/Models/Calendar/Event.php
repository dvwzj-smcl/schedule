<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'sc_events';
    protected $fillable = ['sc_slot_id', 'sc_sub_category_id', 'sc_sale_id', 'sc_customer_id'];

    public function slot(){
        return $this->belongsTo('App\Models\Calendar\Slot', 'sc_slot_id');
    }
    public function sale(){
        return $this->belongsTo('App\Models\User\Sale', 'sc_sale_id');
    }
    public function customer(){
        return $this->belongsTo('App\Models\User\Customer', 'sc_customer_id');
    }
    public function sub_category(){
        return $this->belongsTo('App\Models\Calendar\SubCategory', 'sc_sub_category_id');
    }
    public function color(){
        return $this->slot->doctor->categories()->where('sc_category_id', $this->sub_category->sc_category_id)->first()->color;
    }
    public function duration(){
        return $this->slot->doctor->sub_categories()->where('sc_sub_category_id', $this->sc_sub_category_id)->first()->duration;
    }
    /*
    public function color(){
        return \App\Models\Calendar\DoctorCategory
            ::where('sc_doctor_id', $this->slot->sc_doctor_id)
            ->where('sc_category_id', $this->sub_category->sc_category_id)
            ->first()
            ->color;
    }
    public function duration(){
        return \App\Models\Calendar\DoctorSubCategory
            ::where('sc_doctor_id', $this->slot->sc_doctor_id)
            ->where('sc_sub_category_id', $this->sc_sub_category_id)
            ->first()
            ->duration;
    }
    */
}
