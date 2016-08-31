<?php

namespace App\Http\Controllers\User;

use App\Http\Requests;
use App\Models\Calendar\Category;
use App\Models\User\Doctor;
use Illuminate\Http\Request;
use App\Models\User\Branch;
use App\Models\User\Role;
use App\Models\User\User;
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
            'name',
            'username',
            'email',
            'branch_id'
        ];
        $data = [];
        $sql = User::currentBranch()->select($cols);

        // -- Order
        if (Input::has('order')) {
            foreach (json_decode(Input::get('order')) as $order) {
                $sql->orderBy($order->column, $order->dir);
            }
        }

        $userID = 1;
        $user = Auth::loginUsingId($userID);
        $canEdit = $user->can("edit-users");

        // -- Filter
        if (Input::has('columns')) {
            foreach (json_decode(Input::get('columns')) as $col) {
                $column = $col->data;
                $val = $col->search;
                if (in_array($column, $cols) && ($val != '')) {
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
            $data = $sql->skip(Input::get('start'))->take(Input::get('length'))->with('roles', 'branch')->get();
            foreach ($data as $key => $rs) {
                if (!empty($rs->roles[0]))
                    $rs->role_name = $rs->roles[0]->display_name;
                if (!empty($rs->branch))
                    $rs->branch_name = $rs->branch->name;

                unset($rs->branch);
                unset($rs->roles);
            }
            $result = BF::dataTable($data, $count, $count, $canEdit);
        } catch (\Illuminate\Database\QueryException $e) {
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

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $validator = Validator::make($data, [
                'username' => 'required|between:1,50|not_exists:users,username', // not_exist is custom
                'password' => 'required|between:8,50',
                'passwordConfirm' => 'required|same:password',
                'name' => 'required|between:1,96',
                'email' => 'required|email|not_exists:users,email',
                'branch_id' => 'required|numeric',
                'phone' => 'required|between:3,50',
                'phone_2' => 'between:3,50',
                'roles' => 'required',
            ], BF::getErrorMessage()); // for convenience when needed to change error message in the future
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
            $data["password"] = bcrypt($data["password"]);
            $user = User::create($data);
            if($user == null) throw new \Exception('Cannot create user');
            $user->roles()->sync($data['roles']);

            // Create Doctor
            $user->checkAndCreateDoctor();

            return BF::result(true, ['user' => $user], '[user] create');
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function show($id)
    {
    }

    public function edit($id)
    {
        try {
            if (empty($id)) throw new \Exception('Cannot find user');
            $user = User::with('roles')->find($id);
            $roles = [];
            foreach ($user->roles as $r) {
                $roles[] = $r->id;
            }
            unset($user->roles);
            $user->roles = $roles;
            return BF::result(true, $user);
        } catch (\Exception $e) {
            return BF::result(false, $e->getMessage());
        }

    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        try {
            $validator = Validator::make($data, [
                'username' => 'required|between:1,50', // not_exist is custom
                'password' => 'between:8,50',
                'passwordConfirm' => 'same:password',
                'name' => 'required|between:1,96',
                'email' => 'required|email',
                'branch_id' => 'required|numeric',
                'phone' => 'required|between:3,50',
                'phone_2' => 'between:3,50',
                'roles' => 'required',
            ], BF::getErrorMessage()); // for convenience when needed to change error message in the future
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
            if($request->has('password')) {
                $data["password"] = bcrypt($data["password"]);
            }
            $user = User::find($id);
            $user->update($data);
            if($user == null) throw new \Exception('User not found');
            $user->roles()->sync($data['roles']);

            // Create Doctor
            $user->checkAndCreateDoctor();

            return BF::result(true, ['user' => $user], '[user] create');
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);
            if($user == null) throw new \Exception('User not found!');
            $user->delete();
            return BF::result(true, ['user' => $user]);
        } catch (\Illuminate\Database\QueryException $e){
            if($e->getCode() == 23000) return BF::result(false, 'Cannot delete this user.');
            return BF::result(false, $e->getMessage());
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function duplicate($id)
    {
        if (empty($id)) {
            return BF::result(false, 'ไม่พบข้อมูลนี้ค่ะ');
        }
        $user = User::find($id);
        if (is_null($user)) return BF::result(false, trans('error.not_found', ['id', $id]));
        try {
            $copy = $user->replicate();
            $email = 'copy_' . $copy->email;
            while (User::whereEmail($email)->count() > 0) {
                $email = 'copy_' . $email;
            }
            $copy->email = $email;
            $copy->save();
        } catch (\Illuminate\Database\QueryException $e) {
            return BF::result(false, $e->errorInfo);
        }
        return BF::result(true, ['redirect' => '/app/users']);
    }


}
