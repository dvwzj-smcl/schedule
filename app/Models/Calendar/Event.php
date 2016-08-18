<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'sc_events';
    protected $fillable = ['start', 'end', 'sc_slot_id', 'sc_sub_category_id', 'sale_id', 'sc_customer_id', 'status'];

//    protected $dates = ['start'];

    public function slot(){
        return $this->belongsTo('App\Models\Calendar\Slot', 'sc_slot_id');
    }
    public function sale(){
        return $this->belongsTo('App\Models\User\User', 'sale_id');
    }
    public function customer(){
        return $this->belongsTo('App\Models\User\Customer', 'sc_customer_id');
    }

    /*
     * 1. approved
     * 2. pending
     * 3. rejected
     * 4. cancel
     */
    public function approved()
    {
        return $this->update(['status'=>'approved']);
    }

    public function pending()
    {
        return $this->update(['status'=>'pending']);
    }

    public function rejected()
    {
        return $this->update(['status'=>'rejected']);
    }

    public function cancel()
    {
        return $this->update(['status'=>'canceled']);
    }


    // -- status

    /*
    public function doctor_sub_category(){
        return $this->belongsTo('App\Models\Calendar\DoctorSubCategory', 'sc_doctor_sub_category_id');
    }
    public function color(){
        return $this->slot->doctor->categories()->where('sc_category_id', $this->sub_category->sc_category_id)->first()->color;
    }
    public function duration(){
        return $this->slot->doctor->sub_categories()->where('sc_sub_category_id', $this->sc_sub_category_id)->first()->duration;
    }*/


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
