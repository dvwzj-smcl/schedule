<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use App\Models\User\User;
use Carbon\Carbon;

header('Access-Control-Allow-Origin:  *');
//header('Access-Control-Allow-Origin:  http://schedule.mspinfo.net');
header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, PATCH, DELETE');
header('Access-Control-Allow-Headers:  Content-Type, Authorization, Access-Token');

Route::get('/', function () {
    return view('welcome');
});
Route::get('/debugger', 'DebuggerController@index');

//--- Route ที่ไม่มีการเช็ค auth user
Route::group(['prefix' => 'api', 'middleware' => []], function () {
    Route::post('auth', 'User\AuthController@Login');
});

Route::group(['prefix' => 'api', 'middleware' => ['jwt.auth'/*,'permission'*/]], function () {
    
    // User Module
    Route::controller('auth', 'User\AuthController');
    Route::resource('users', 'User\UserController');
    
    Route::get('branches/list', 'User\BranchController@getList');
    Route::resource('branches', 'User\BranchController');
    
    Route::controller('roles', 'User\RoleController');
    Route::resource('roles', 'User\RoleController');
    
    Route::resource('permissions', 'User\PermissionController');

    // Schedules Module
    Route::group(['prefix'=>'schedules'], function() {
        Route::get('init', 'Schedule\ScheduleController@init');
        Route::get('doctors/{doctor_id}/slots', 'Schedule\ScheduleController@getDoctorSlots');
        Route::get('doctors/{doctor_id}/events/{date?}', 'Schedule\ScheduleController@getDoctorSlotsWithEvents');
        Route::get('organizer/{user_id}/events', 'Schedule\ScheduleController@getOrganizerEvents');
        
        // Customer
        Route::get('customers/{customer_id}/events', 'Schedule\CustomerController@getCustomerEvents');
        Route::resource('customers', 'Schedule\CustomerController');

        // Dashboard
        Route::get('tasks', 'Schedule\ScheduleController@getTasks');
        Route::get('events-status', 'Schedule\ScheduleController@getEventsStatus');

        // Schedule
        Route::resource('events', 'Schedule\EventController');
        Route::get('events/{id}/status/{status}', 'Schedule\EventController@setStatus');
        Route::get('events/{id}/confirm-status/{status}', 'Schedule\EventController@setConfirmStatus');

        // Slot
        Route::resource('slots', 'Schedule\SlotController');
        
        // Settings
        Route::resource('subcategories', 'Schedule\SubcategoryController');
        Route::resource('doctors', 'Schedule\DoctorController');
    });
});