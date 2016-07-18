<?php namespace App\Models;

use Auth;

trait Updater
{

    protected static function boot()
    {
        parent::boot(); /* * During a model create Eloquent will also update the updated_at field so * need to have the updated_by field here as well * */
        static::creating(function ($model) {
            $model->created_by = Auth::user()->id;
            \Log::info('creating - '.$model->getTable());
            return true;
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::user()->id;
            \Log::info('updating - '.$model->getTable());

        });

        /*
         * Deleting a model is slightly different than creating or deleting. For
         * deletes we need to save the model first with the deleted_by field
         * */
        static::deleting(function ($model) {
            \Log::info('deleting - '.$model->getTable());
            $model->deleted_by = Auth::user()->id;
            $model->save();
        });

    }

}