<?php namespace App\Semi\BaseFunction;

use \Firebase\JWT\JWT;
use Input;
use Validator;

class BaseFunctionManager {

    // action is for logging
    public static function result($success = true, $message = [], $action = false) {
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

    public static function dataTable($tbData, $countFilter, $countTotal, $canEdit = true) {
        return [
            'tbData' => $tbData,
            'recordsFiltered' => $countFilter,
            'recordsTotal' => $countTotal,
            'canEdit' => $canEdit
        ];
    }

    public static function getErrorMessage() {
        return [
            /* // reserved for future use
            'required' => 'The :attribute field is required.',
            'same' => 'The :attribute and :other must match.',
            'size' => 'The :attribute must be exactly :size.',
            'between' => 'The :attribute must be between :min - :max.',
            'in' => 'The :attribute must be one of the following types: :values',
            'email' => 'Invalid email',
            'numeric' => 'The :attribute must be number',
            */
            'not_exists' => 'The :attribute already exist.',
        ];
    }

    public static function getRandomColor() {
        $colors = ['#C22326','#F37338','#027878','#FDB632','#801638','#2B80B9'];
        return $colors[rand(0, count($colors)-1)];
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

    public static function hasRole($role) {
        return \Auth::user()->hasRole($role);
    }

    /*
     * For making Create / Update / Delete much easier
     */

    public static function destroy($obj, $model = 'entity', $errorMsg = null) {
        try {
            if($obj == null) throw new \Exception("{ucfirst($model)} not found!");
            $obj->delete();
            
            if(isset($model)) {
                $logMsg = "[delete] {$model}";
            } else {
                $logMsg = "[delete] something";
            }
            
            return static::result(true, [], $logMsg);
        } catch (\Illuminate\Database\QueryException $e){
            if($errorMsg === null) {
                $errorMsg = 'Cannot delete because there are some data associate with it';
            }
            if($e->getCode() == 23000) return static::result(false, $errorMsg);
            return static::result(false, $e->getMessage());
        } catch (\Exception $e){
            return static::result(false, $e->getMessage());
        }
    }

    public static function store($params) {
        $params['actionType'] = 'create';
        return static::storeOrUpdate($params);
    }
    
    public static function update($params) {
        $params['actionType'] = 'update';
        return static::storeOrUpdate($params);
    }
    
    public static function storeOrUpdate($params) {
        extract($params);
        /*
         * validator
         * action
         * postAction
         * model
         * actionType
         */
        $data = Input::all();
        try {
            if(!empty($validator)) {
                $validator = Validator::make($data, $validator, static::getErrorMessage());
                if ($validator->fails()) {
                    throw new \Exception($validator->errors()->first());
                }
            }

            // Do something like Model::create()
            if(isset($action)) {
                $obj = $action($data);
            }

            $actionStr = isset($actionType) ? $actionType : 'do something';
            if(isset($model) && isset($actionType)) {
                $actionErrorMsg = "Cannot {$actionStr} {$model}";
                $logMsg = "[{$actionStr}] {$model}";
            } else {
                $actionErrorMsg = "Cannot {$actionStr}";
                $logMsg = "[{$actionStr}] something";
            }
            if(empty($obj)) throw new \Exception("{$actionErrorMsg}");
            
            // After create/update
            if(isset($postAction)) {
                $obj = $postAction($obj);
            }
            
            return static::result(true, [$model ? $model : 'obj' => $obj], $logMsg);
        } catch(\Exception $e) {
            return static::result(false, $e->getMessage());
        }
    }

    public static function getDataTable($sql, $model = 'entity', $processData = null) {
        $data = Input::all();
        /*
         * order
         * column
         * filter
         * start
         * length
         */

        try {
            // --- Order
            if (Input::has('order')) {
                foreach (json_decode(Input::get('order')) as $order) {
                    $sql->orderBy($order->column, $order->dir);
                }
            }

            // -- Filter
            if (Input::has('columns')) {
                foreach (json_decode(Input::get('columns')) as $col) {
                    $column = $col->data;
                    $val = $col->search;
                    if ($val != '') {
                        $sql->where($column, 'LIKE', '%' . $val . '%');
                    }
                }
            }

            /*DB::enableQueryLog();
            $sql->get();
            $query = DB::getQueryLog();
            return $query ;
            exit();*/

            $count = $sql->count();
            $data = Input::has('length')&&Input::get('length')!=0 ? $sql->skip(Input::get('start'))->take(Input::get('length'))->get() : $sql->get();
            // $data = $sql->skip(Input::get('start'))->take(Input::get('length'))->get();

            if(is_callable($processData)) {
                $data = $processData($data);
            }

            // no need for logging message
            return static::result(true, static::dataTable($data, $count, $count));
        } catch(\Exception $e) {
            return static::result(false, $e->getMessage());
        }
    }

}