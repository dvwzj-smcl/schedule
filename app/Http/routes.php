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

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix'=>'api'], function(){
    header('Access-Control-Allow-Origin:  http://localhost:3000');
    header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, PATCH, DELETE');
    header('Access-Control-Allow-Headers:  Content-Type, Authorization, Access-Token');
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
            return response()->json(['access_token' => JWT::encode(Auth::user(), env('APP_KEY'))]);
        }else if(User::where('username', $decode->username)->count()){
            return response()->json(['error' => 'incorrect password']);
        }else{
            return response()->json(['error' => 'user not found']);
        }
    });
});