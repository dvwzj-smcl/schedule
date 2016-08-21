<?php namespace App\Semi\BaseFunction;

use \Firebase\JWT\JWT;

class BaseFunctionManager {

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
            return response(static::result(false, $e->getMessage()), 401);
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

    public static function getBranchId() {
        //return \Auth::user()->branch_id;
        return \Auth::check() ? \Auth::user()->branch_id : null; // for test
    }

    public static function getUserId() {
        return \Auth::user()->id;
    }

    public static function isOrganizer() {
        return \Auth::user()->hasRole('organizer');
    }

}