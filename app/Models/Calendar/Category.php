<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'sc_categories';
    protected $fillable = ['name', 'color'];
    public $timestamps = false;

    public function sub_categories(){
        return $this->hasMany('App\Models\Calendar\SubCategory', 'sc_category_id');
    }
}
