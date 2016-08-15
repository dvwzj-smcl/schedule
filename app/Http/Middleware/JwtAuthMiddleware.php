<?php

namespace App\Http\Middleware;


use App\Models\User\User;
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
        // true: to fake auth if no access token
        // false: normal and secured
        $debugMode = true;

        $access_token = $request->header('Access-Token');
        if($debugMode && empty($access_token)) {
            $user = User::with(['roles' => function ($query) {
                $query->where('name', 'sale');
            }])->first();
            Auth::loginUsingId($user->id);
        } else {
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
        }
       
        return $next($request);
    }
}
