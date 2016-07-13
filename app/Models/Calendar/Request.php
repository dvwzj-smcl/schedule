<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $table = 'sc_requests';
    protected $fillable = ['approved', 'event_id', 'sale_id'];
}
