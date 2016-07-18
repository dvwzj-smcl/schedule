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
        return ['status' => 'error', ['data' => ['error' => $message]]];
    }

    public static function decodeInput($request) {

        //$data = json_decode($request);
        //print_r(['data->appKey'=>$data->appKey, 'getenv'=>getenv('APP_KEY')]);
        //exit();
      
//        JWT::$leeway = 60; // $leeway in seconds
        $decoded = JWT::decode($request, getenv('APP_KEY'), array('HS256'));
//        $decoded = JWT::decode($request->getContent(), getenv('APP_KEY') , array('HS256'));
        $decoded = (array)$decoded ;
        return (array)$decoded['payload'];
    }

}