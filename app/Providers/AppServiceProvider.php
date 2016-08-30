<?php

namespace App\Providers;

use Validator;
use DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('not_exists', function ($attribute, $value, $parameters) {
            $query = DB::table($parameters[0])->where($parameters[1], '=', $value);
            if(isset($parameters[2])) {
                $query->andWhere($parameters[2], '<>', $value);
            }
            return $query->count() < 1;
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
