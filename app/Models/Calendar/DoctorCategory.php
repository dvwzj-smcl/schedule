<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class DoctorCategory extends Model
{
    protected $table = 'sc_doctor_categories';
    protected $fillable = ['sc_doctor_id', 'sc_category_id', 'color'];
    public $timestamps = false;
}
