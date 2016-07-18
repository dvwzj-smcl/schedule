<?php namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
class Branch extends Model {

    protected $table = 'branches';
    public $timestamps = true ;
    protected $fillable = array(
        'name',
        'email',
        'phone',
        'fax',
        'address',
        'distinct',
        'amphur',
        'province',
        'country_id',
        'zipcode',
        'desc',
    );

}