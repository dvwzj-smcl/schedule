<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class SlotCategory extends Model
{
    protected $table = 'sc_slot_categories';
    protected $fillable = ['sc_slot_id', 'sc_category_id'];
    public $timestamps = false;

    public function categories(){
        return $this->hasMany('App\Models\Calendar\Category', 'id', 'sc_category_id');
    }
}
