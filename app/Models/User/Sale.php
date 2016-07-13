<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sc_sales';
    protected $fillable = ['user_id'];

    public function user(){
        return $this->belongsTo('App\Models\User\User');
    }
}
