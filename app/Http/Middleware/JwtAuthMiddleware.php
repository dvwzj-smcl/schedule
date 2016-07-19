<?php

namespace App\Http\Middleware;


use Carbon\Carbon;
use Closure;
use BF;
use Auth;
use Input;
use \Firebase\JWT\JWT;

class JwtAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $access_token = $request->header('Access-Token');
        try {
            $user = JWT::decode($access_token, getenv('APP_KEY') , array('HS256'));
        } catch ( \Firebase\JWT\ExpiredException $e) {
            return response(BF::result(false, $e->getMessage()), 401);
        }
        $dateExpire = $user->exp ;
        $dateNow = (int) Carbon::now()->timestamp ;
        // check token expire
        if ($dateNow > (int)$dateExpire) {
            return response(BF::result(false, 'Expired token'), 401);
        }
        // check auth user
        try {
            $auth = Auth::loginUsingId($user->id);
            if($auth === NULL) {
                return response(BF::result(false, 'permission denied.'), 401);
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            return response(BF::result(false, $e->getMessage()), 401);
        }
        return $next($request);



//        $input = BF::decodeInput($request);
//
//        var_dump($input);
//        exit();
//
//
//        $user = JWT::decode($input['userToken'], getenv('APP_KEY') , array('HS256'));
//        $dateExpire = $user->exp ;
//        $dateNow = (int) Carbon::now()->timestamp ;
//
//        // check token expire
//        if ($dateNow > (int)$dateExpire) {
//            return response(BF::result(false, 'Token Expire.'), 401);
//        }
//
//        // check auth user
//        try {
//            $auth = Auth::loginUsingId($user->id);
//            if($auth === NULL) {
//                return response(BF::result(false, 'permission denied.'), 401);
//            }
//        } catch ( \Illuminate\Database\QueryException $e) {
//            return response(BF::result(false, $e->getMessage()), 401);
//        }
//
//        return $next($request);
    }
}
