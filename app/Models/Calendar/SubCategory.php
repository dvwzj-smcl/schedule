<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    protected $table = 'sc_sub_categories';
    protected $fillable = ['name', 'sc_category_id', 'duration'];
    public $timestamps = false;

    public function category(){
        return $this->belongsTo('App\Models\Calendar\Category', 'sc_category_id');
    }
}
