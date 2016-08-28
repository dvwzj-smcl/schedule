<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use DB;

class Doctor extends Model
{
    protected $table = 'sc_doctors';
    protected $fillable = ['color', 'user_id', 'data'];
    protected $casts = [
        'data' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
//        static::addglobalscope('branch', function(Builder $builder) {
//            $builder->join('users', function ($join) {
//                $join->on('users.id', '=', 'sc_doctors.user_id')
//                    ->where('users.branch_id', '=', \BF::getbranchid());
//            });
//        });
    }

    public function scopeCurrentBranch($query)
    {
        return $query->
        join(DB::raw('(SELECT branch_id, users.id as user_id FROM users) AS ut'), function ($join) {
            $join->on('ut.user_id', '=', 'sc_doctors.user_id')
                 ->where('ut.branch_id', '=', \BF::getbranchid());
        });
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User\User');
    }

    public function categories()
    {
        return $this->hasMany('App\Models\Calendar\DoctorCategory', 'sc_doctor_id');
    }

    public function sub_categories()
    {
        return $this->hasMany('App\Models\Calendar\DoctorSubCategory', 'sc_doctor_id');
    }

    public function slots()
    {
        return $this->hasMany('App\Models\Calendar\Slot', 'sc_doctor_id', 'id');
    }
}
