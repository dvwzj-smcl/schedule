<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'sc_events';
    protected $guarded = ['id', 'created_at', 'updated_at'];
    
//    protected $fillable = ['start', 'end', 'sc_slot_id', 'sc_sub_category_id', 'sale_id', 'sc_customer_id', 'status'];
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
    public function approve()
    {
        return $this->update(['status'=>'approved']);
    }

    public function pending()
    {
        return $this->update(['status'=>'pending']);
    }

    public function reject()
    {
        return $this->update(['status'=>'rejected']);
    }

    public function cancel()
    {
        return $this->update(['status'=>'canceled']);
    }
}
