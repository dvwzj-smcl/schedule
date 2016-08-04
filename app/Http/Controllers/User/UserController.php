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
        $sql = User::currentBranch()->select($cols);

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
            $data = $sql->skip(Input::get('start'))->take(Input::get('length'))->with('roles','branch')->get();
            foreach ($data as $key=>$rs) {
                if (!empty($rs->roles[0]))
                    $rs->role_name = $rs->roles[0]->display_name;
                if (!empty($rs->branch))
                    $rs->branch_name = $rs->branch->name;

                unset($rs->branch);
                unset($rs->roles);
            }
            $result = BF::dataTable($data, $count, $count, $canEdit) ;
        } catch ( \Illuminate\Database\QueryException $e) {
            return BF::result(false, $e->getMessage());
        }

        return BF::result(true, $result, '[user] index');
    }

    public function create()
    {
        $data = [
            'roles' => Role::all(),
            'branches' => Branch::all()
        ];
        return BF::result(true, $data, '[user] create');
    }

    public function store()
    {

       
        $testMode = true ;
        $userId =  ($testMode)? 1 : Auth::user()->id ;

        $data = Input::all();
        $rules = array(
            'username' => 'required|min:3|max:50',
            'password' => 'required|min:3|max:50',
            'confirmPassword' => 'required|min:3|max:50',
            'name' => 'required|min:3|max:50',
            'email' => 'required|email',
            'branch' => 'required|numeric',
            'phone' => 'required|min:3|max:50',
            'phone2' => 'min:3|max:50',
            'roles' => 'required',
        );

        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return BF::result(false, $validator->messages()->first());
        }

        if ($data["password"] != $data["confirmPassword"] ){
            return BF::result(false, 'กรุณากรอกพาสเวิดให้ตรงกันค่ะ!');
        }
        if(empty($data["email"])){
            return BF::result(false, 'กรุณากรอกอีเมล์ค่ะ!');
        }
        try {
            $chk = User::where('email', $data["email"])->first();
            if(isset($chk)){
                return BF::result(false, 'อีเมล์นี้มีในระบบอยู่แล้วค่ะ!'); //--- check email repeat
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "อีเมล์ซ้ำ: {$data['email']}");
            }
            return BF::result(false, $e->getMessage());
        }
        try {
            $chk = User::where('username', $data["username"])->first();
            if(isset($chk)){
                return BF::result(false, 'ผู้ใช้นี้มีอยู่ในระบบอยู่แล้วค่ะ!'); //--- check email repeat
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "user name ซ้ำ : {$data['email']}");
            }
            return BF::result(false, $e->getMessage());
        }

        $data["password"] = bcrypt($data["password"]) ;
        $data = array_diff_key($data, array_flip(['id','_method','deleted_at','deleted_by','updated_at','created_at']));
        $data["created_by"] = $userId ;
        $data["branch_id"] = $data["branch"] ;
        $data["phone_2"] = $data["phone2"] ;

        try {
            $status = User::create($data);
            if($status === NULL) {
                return BF::result(false, 'failed!');
            }

            $status->roleUser()->sync($data['roles']);
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "ชื่อซ้ำ: {$data['name']}");
            }
            return BF::result(false, $e->getMessage());
        }
        return BF::result(true, [] , '[user] create');
    }

    public function show($id)
    {
    }

    public function edit($id)
    {

        if(empty($id)){
            return BF::result(false, 'ไม่พบข้อมูลนี้ค่ะ');
        }
        $user = User::with('roles')->find($id);
        $user->password = '';
        $user->branchId = $user->branch_id;
        //---  ใช้ isEmpty เพราะ collection มัน return ค่าบางอย่างมาแม้ array เป็น null

        $roles = [] ;
        if(!$user->roles->isEmpty()){
            foreach ($user->roles as $r) {
                $roles[] = $r->id ;
            }
        }

        $user->roleId = $roles ;
        unset($user->roles);
        unset($user->branch_id);
        unset($user->password);
        $user->roles = Role::all() ;
        $user->branches = Branch::all() ;
        return BF::result(true,$user , '[user] create');
    }

    public function update($id)
    {
        if(empty($id)){
            return BF::result(false, 'ไม่พบข้อมูลนี้ค่ะ');
        }
        $testMode = true ;
        $userId =  ($testMode)? 1 : Auth::user()->id ;

        $data = Input::all();

        $rules = array(
            'username' => 'required|min:3|max:50',
            'name' => 'required|min:3|max:50',
            'email' => 'required|email',
            'branch' => 'required|numeric',
            'phone' => 'required|min:3|max:50',
            'phone2' => 'min:3|max:50',
            'roles' => 'required',
        );
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return BF::result(false, $validator->messages()->first());
        }

        if(empty($data["email"])){
            return BF::result(false, 'กรุณากรอกอีเมล์ค่ะ!');
        }

        if (!empty($data["password"])) {
            if (empty($data["confirmPassword"])){
                return BF::result(false, 'กรุณาคอนเฟริมพาสเวิดค่ะ!');
            }
            if ($data["password"] != $data["confirmPassword"]){
                return BF::result(false, 'กรุณากรอกพาสเวิดให้ตรงกันค่ะ!');
            }
            $data["password"] = \Hash::make($data["password"]);
        } else {
            unset($data["password"]);
        }

        try {
            $chk = User::where('email', $data["email"])->where('id','!=',$id)->first();
            if(isset($chk)){
                return BF::result(false, 'อีเมล์นี้มีในระบบอยู่แล้วค่ะ!'); //--- check email repeat
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "อีเมล์ซ้ำ: {$data['email']}");
            }
            return BF::result(false, $e->getMessage());
        }
        try {
            $chk = User::where('username', $data["username"])->where('id','!=',$id)->first();
            if(isset($chk)){
                return BF::result(false, 'ผู้ใช้นี้มีอยู่ในระบบอยู่แล้วค่ะ!'); //--- check email repeat
            }
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "user name ซ้ำ : {$data['email']}");
            }
            return BF::result(false, $e->getMessage());
        }

        $data = array_diff_key($data, array_flip(['id','_method','deleted_at','deleted_by','updated_at','created_at']));
        $data["updated_at"] = $userId ;
        $data["branch_id"] = $data["branch"] ;
        $data["phone_2"] = $data["phone2"] ;
        $sync = [];
        $sync['roles'] = $data['roles'] ;
        try {
            unset($data['branch']);
            unset($data['phone2']);
            unset($data['roles']);
            $obj =  User::find($id) ;
            $status = $obj->update($data);
            if($status === NULL) {
                return BF::result(false, 'failed!');
            }

            $obj->roleUser()->sync($sync['roles']);
        } catch ( \Illuminate\Database\QueryException $e) {
            if($e->getCode() == 23000) {
                return BF::result(false, "ชื่อซ้ำ: {$data['name']}");
            }
            return BF::result(false, $e->getMessage());
        }
        return BF::result(true, [] , '[user] update');

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
