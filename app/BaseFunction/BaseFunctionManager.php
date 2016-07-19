<?php namespace App\BaseFunction;

use App\BaseFunction\BaseFunctionManager as BF;
use Auth;
use \Firebase\JWT\JWT;
use \Illuminate\Http\Request ;

class BaseFunctionManager {

    public function doSomething()
    {
        echo 'Do something!';
    }

    public static function result($success = true, $message, $action = false) {
        if($success) {
            $res = ['status' => 'success', 'data' => $message];
            if($action) $res['action'] = $action;
            return $res;
        }
        return ['status' => 'error', 'data' => ['error' => $message]];
    }

    public static function decodeInput($request) {
        try {
            $decoded = JWT::decode($request, env('APP_KEY'), array('HS256'));
        } catch ( \Firebase\JWT\ExpiredException $e) {
            return response(BF::result(false, $e->getMessage()), 401);
        }
        $decoded = (array)$decoded ;
        return (array)$decoded['payload'];
    }

    public static function dataTable($tbData, $countFilter, $countTotal, $canEdit) {
        return [
            'tbData' => $tbData,
            'recordsFiltered' => $countFilter,
            'recordsTotal' => $countTotal,
            'canEdit' => $canEdit
        ];
    }

}