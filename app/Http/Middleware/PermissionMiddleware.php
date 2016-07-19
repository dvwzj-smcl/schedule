<?php

namespace App\Http\Middleware;


use App\Models\PermRole;
use Carbon\Carbon;
use Closure;
use DB;
use Illuminate\Support\Facades\Request;
use Session;
use BF;
use Auth;
use Input;
use \Firebase\JWT\JWT;

class PermissionMiddleware
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

        // todo: only for users/roles view/edit. allow otherwise.
        $user = $request->user();

        return response(BF::result(false, $user->id), 401);
              
        User::find(1)->getAllPermissions();

//        $user = $request->user();
//        if(empty($user)) {
//            Auth::logout();
//            return response(BF::result(false, 'permission denied.'), 401);
//        }
//        $roleId = $user->role_id ;
//        $url = $request->url();
//        $seg = explode('/', $url);
//        if($seg[4]=='public') {
//            $base = $seg[6];
//            if(isset($seg[7])) $base2 = $seg[7];
//        } else {
//            $base = $seg[5];
//            if(isset($seg[6])) $base2 = $seg[6];
//        }
//        $last = array_pop($seg);
//        if($request->isMethod('get')) {
//            if(is_numeric($last)) {
//                $permName = "'$base.view'";
//            } else{
//                $permName = "'$base.$last'";
//            }
//        } else if($request->isMethod('post')) {
//            $permName = "'$base.create'";
//        } else if($request->isMethod('patch')) {
//            $permName = "'$base.edit'";
//        } else if($request->isMethod('delete')) {
//            $permName = "'$base.edit'";
//        }
//
//        // check permission user
//        try {
//
//            $permName = 'credits.edit' ;
//
//            $permission = PermRole::join('permissions', 'perm_role.permission_id', '=', 'permissions.id')
//                ->select('perm_role.id')
//                ->where('perm_role.role_id', '=', $roleId)
//                ->where('permissions.name', '=', $permName)
//                ->first();
//            if(empty($permission)){
//                return response(BF::result(false, 'permission denied.'), 403);
//            }
//        } catch ( \Illuminate\Database\QueryException $e) {
//            return response(BF::result(false, $e->getMessage()), 401);
//        }

        return $next($request);
    }
}
