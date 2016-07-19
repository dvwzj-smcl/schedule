<?php

namespace App\Http\Controllers\User;

use App\Http\Requests;

use App\Models\User\Branch;
use App\Models\User\Role;
use App\Models\User\User;


use Illuminate\Support\Facades\DB;
use Input;
use BF;
use Validator;
use Auth;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index()
    {
        $cols = [
            'id',
            'email',
            'branch_id'
        ] ;
        $data = [];
        $sql = User::select($cols);

        // -- Order
        if (Input::has('order')){
            foreach (json_decode(Input::get('order')) as $order) {
                $sql->orderBy($order->column, $order->dir);
            }
        }
        
        $userID = 1 ;
        $user = Auth::loginUsingId($userID) ;
        $canEdit = $user->can("edit-users") ;




        // -- Filter
        if (Input::has('columns')){
            foreach (json_decode(Input::get('columns')) as $col) {
                $column = $col->data;
                $val = $col->search;
                if (in_array($column, $cols) && ( $val != '') ) {
                    $sql->where($column, 'LIKE', '%' . $val . '%');
                }
            }
        }

//        DB::enableQueryLog();
//        $sql->get();
//        $query = DB::getQueryLog();
//        return $query ;
//        exit();

        try {
            $count = $sql->count();
            $data = $sql->skip(Input::get('start'))->take(Input::get('length'))->get();
            $result = BF::dataTable($data, $count, $count, $canEdit) ;
        } catch ( \Illuminate\Database\QueryException $e) {
            return BF::result(false, $e->getMessage());
        }

        return BF::result(true, $result, '[usertype] index');
    }

    public function create()
    {
        $data = [
            'roles' => Role::all(),
            'usertypes' => UserType::all(),
            'branches' => Branch::all()
        ];
        return BF::result(true, ['action' => 'create', 'data' => $data]);
    }

    public function store()
    {
        $data = Input::all();
        $auth = BF::authLoginFail($data);
        if($auth) {
            return $auth ;
        }
        if ($data["password"] != $data["confirm_password"] ){
            return BF::result(false, 'กรุณากรอกพาสเวิดให้ตรงกันค่ะ!');
        }
        if(empty($data["email"])){
            return BF::result(false, 'กรุณากรอกอีเมล์ค่ะ!');
        }
        try {
            $chk = User::where('email', $data["email"])->first();
            if(isset($chk)){
                return BF::result(false, 'failed!'); //--- check email repeat
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "อีเมล์ซ้ำ: {$data['email']}");
            }
            return BF::result(false, $e->getMessage());
        }

        $data["password"] = bcrypt($data["password"]) ;
        $data = array_diff_key($data, array_flip(['id','_method','deleted_at','deleted_by','updated_at','created_at']));

        $data["created_by"] = Auth::user()->id ;
        try {
            $status = User::create($data);
            if($status === NULL) {
                return BF::result(false, 'failed!');
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "ชื่อซ้ำ: {$data['name']}");
            }
            return BF::result(false, $e->getMessage());
        }
        return BF::result(true, ['action' => 'create', 'id' => $status->id]);
    }

    public function show($id)
    {
    }

    public function edit($id)
    {
        $user = User::find($id);
        $user->password = '';
        return BF::result(true, ['action' => 'edit', 'data' => $user]);
    }

    public function update($id)
    {
        if(empty($id)){
            return BF::result(false, 'ไม่พบข้อมูลนี้ค่ะ');
        }
        $data = Input::all();
        $data = array_diff_key($data, array_flip(['id','confirm_password', '_method','deleted_at','deleted_by','updated_at','created_at']));

        if(isset($data["change_pass"]) && $data["change_pass"] == true) {
            if (!empty($data["password"])) {
                $data["password"] = \Hash::make($data["password"]);
            } else {
                unset($data["password"]);
            }
        } else {
            unset($data["password"]);
        }
        unset($data["change_pass"]);
        $auth = BF::authLoginFail($data);
        if($auth) {
            return $auth ;
        }
        $data["updated_by"] = Auth::user()->id ;
//        $data["updated_by"] = Session::get('user_id');
        try {
            $status = User::whereId($id)->update($data);
            if($status == 1) {
                return BF::result(true, ['action' => 'update', 'id' => $id]);
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "ชื่อซ้ำ: {$data['name']}");
            }
            return BF::result(false, $e->getMessage());
        }

        return BF::result(false, 'failed!');
    }

    public function destroy($id)
    {
        if(empty($id)){
            return BF::result(false, 'ไม่พบข้อมูลนี้ค่ะ');
        }
        $data = User::find($id);
        if (is_null($data)) {
            User::withTrashed()->whereId($id)->first()->restore();
            return BF::result(true, ['action' => 'restore', 'id' => $id]);
        }else{
            $data->delete();
            return BF::result(true, ['action' => 'delete', 'id' => $id]);
        }
    }

    public function duplicate($id)
    {
        if(empty($id)){
            return BF::result(false, 'ไม่พบข้อมูลนี้ค่ะ');
        }
        $user = User::find($id);
        if(is_null($user)) return BF::result(false, trans('error.not_found', ['id', $id]));
        try {
            $copy = $user->replicate();
            $email = 'copy_'.$copy->email;
            while(User::whereEmail($email)->count() > 0) {
                $email = 'copy_'.$email;
            }
            $copy->email = $email;
            $copy->save();
        } catch(\Illuminate\Database\QueryException $e) {
            return BF::result(false, $e->errorInfo);
        }
        return BF::result(true, ['redirect' => '/app/users']);
    }

   

}
