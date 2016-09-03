<?php

namespace App\Http\Controllers\User;

use App\Models\User\Branch;
use App\Models\User\Customer;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;
use Validator;

class BranchController extends Controller
{
    public function index()
    {
        return BF::getDataTable(Branch::query(), 'branch');
    }

    public function getList()
    {
        return BF::result(true, Branch::all(), '[branch] index');
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
        return BF::store([
            'model' => 'branch',
            'action' => function($data) {
                return Branch::create($data);
            },
            'validator' => [
                'name' => 'required|between:1,96|not_exists:branches,name',
                'email' => 'required|email',
                'phone' => 'required|between:3,50',
            ]
        ]);
    }

    public function show($id)
    {
    }

    public function edit($id)
    {
        return BF::result(true, Branch::find($id));
    }

    public function update(Request $request, $id)
    {
        return BF::update([
            'model' => 'branch',
            'action' => function($data) use ($id) {
                return Branch::find($id)->update($data);
            },
            'validator' => [
                'name' => 'required|between:1,96',
                'email' => 'required|email',
                'phone' => 'required|between:3,50',
            ]
        ]);
    }

    public function destroy($id)
    {
        return BF::destroy(Branch::find($id));
    }
}
