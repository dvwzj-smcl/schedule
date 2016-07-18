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

header('Access-Control-Allow-Origin:  http://localhost:3000');
header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, PATCH, DELETE');
header('Access-Control-Allow-Headers:  Content-Type, Authorization, Access-Token');

Route::get('/', function () {
    return view('welcome');
});

//--- Route ที่ไม่มีการเช็ค auth user
Route::group(['prefix' => 'api', 'middleware' => []], function () {
    Route::post('auth', 'AuthController@Login');
});

//--- Route ที่มีการเช็ค auth user
Route::group(['prefix' => 'api', 'middleware' => ['jwt.auth','permission']], function () {
    Route::controller('auth', 'AuthController');
    Route::resource('user', 'UserController');
    Route::resource('branch', 'BranchController');
    Route::resource('permission', 'PermissionController');
    Route::resource('role', 'RoleController');
    Route::resource('usertype', 'UserTypeController');
});

Route::group(['prefix'=>'api'], function(){
    Route::get('/', function(){
        return response('ready',200);
    });
    /*
    Route::get('test-auth/{username}/{password}', function($username, $password){
        return response()->json([
            'token' => JWT::encode(['username' => $username,'password' => $password], env('APP_KEY'))
        ]);
    });
    */
    Route::post('auth', function(Request $request){
        $token = $request->getContent();
        $decode = JWT::decode($token, env('APP_KEY'), ['HS256']);
        if(Auth::once(['username' => $decode->username, 'password' => $decode->password])){
            $user = Auth::user();
            $isAdmin = $user->hasRole('admin');
            $isDoctor = $user->doctor;
            $isOrganizer = $user->organizer;
            $isSale = $user->sale;
            return response()->json(['access_token' => JWT::encode($user, env('APP_KEY')), 'isAdmin'=>$isAdmin, 'isDoctor'=>$isDoctor, 'isOrganizer'=>$isOrganizer, 'isSale'=>$isSale]);
        }else if(User::where('username', $decode->username)->count()){
            return response()->json(['error' => 'incorrect password']);
        }else{
            return response()->json(['error' => 'user not found']);
        }
    });
    Route::group(['prefix'=>'calendar'], function(){
        Route::get('events/{year?}/{month?}', function(Request $request,$year=null,$month=null){
            if(is_null($year)){
                $year = date('Y');
            }
            if(is_null($month)){
                $month = date('m');
            }
            $date = Carbon::createFromDate($year, $month);
            $start = $date->startOfMonth()->format('Y-m-d');
            $end = $date->endOfMonth()->format('Y-m-d');
            $slots = [];
            $events = [];
            //\DB::enableQueryLog();
            foreach(\App\Models\Calendar\Slot::whereBetween(\DB::raw('substr(sc_slots.start,1,10)'), [$start, $end])->get() as $slot){
                $response = $slot->response();
                $events = array_merge($events, $response['events']);
                $slots[] = $response['slot'];
            }
            return response()->json(['between'=>[$start,$end], 'events' => $events, 'slots'=>$slots],200, array(), JSON_PRETTY_PRINT);
        });
        Route::get('event/{event}', function(Request $request, \App\Models\Calendar\Event $event){
            $event = $event
                ->with('slot')
                ->with('slot.doctor')
                ->with('slot.organizer')
                ->with('sub_category')
                ->with('sub_category.category')
                ->with('sale')
                ->with('customer')
                ->first();
            return response()->json($event, 200, array(), JSON_PRETTY_PRINT);
        })->where('event', '[0-9]+');
        Route::get('event/{date?}', function(Request $request, $date=null){
            if(is_null($date)){
                $date = date('Y-m-d');
            }
            $slots = [];
            $events = [];
            foreach(\App\Models\Calendar\Slot::where('start', 'like', $date.'%')->get() as $slot){
                $response = $slot->response();
                $events = array_merge($events, $response['events']);
                $slots[] = $response['slot'];
            }
            return response()->json(['events' => $events, 'slots'=>$slots],200, array(), JSON_PRETTY_PRINT);
        })->where('date', '[0-9-]+');
        Route::get('slot/{slot}', function(Request $request, \App\Models\Calendar\Slot $slot){
            $response = $slot->response();
            return response()->json($response['slot'],200, array(), JSON_PRETTY_PRINT);
        });
        Route::get('doctors', function(Request $request){
            return response()->json(['doctors'=>\App\Models\User\Doctor::with('user')->get()],200, array(), JSON_PRETTY_PRINT);
        });
        Route::get('categories', function(Request $request){
            return response()->json(['categories'=>\App\Models\Calendar\Category::all()],200, array(), JSON_PRETTY_PRINT);
        });
        Route::post('slot', function(Request $request){
            return response()->json(['result'=>$request->all()],200, array(), JSON_PRETTY_PRINT);
        });
        Route::get('doctor/{doctor_id}/slot', function(Request $request, $doctor_id){
            $slots = App\Models\Calendar\Slot::where('sc_doctor_id', $doctor_id)->get();
            return response()->json(['slots'=>$slots],200, array(), JSON_PRETTY_PRINT);
        });
    });
});