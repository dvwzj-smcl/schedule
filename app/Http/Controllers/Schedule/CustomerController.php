<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Event;
use App\Models\Calendar\SubCategory;
use App\Models\User\Customer;
use App\Models\User\Doctor;
use Illuminate\Http\Request;
use BF;
use Validator;
use Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class CustomerController extends Controller
{
    public function index()
    {
        $cols = [
            'id',
            'first_name',
            'last_name',
            'hn',
            'phone',
            'contact'
        ];
        $sql = Customer::select($cols);
        if(Input::has('id')){
            $sql->where('id', '=', Input::get('id'));
        }else {
            if (Input::has('order')) {
                foreach (json_decode(Input::get('order')) as $order) {
                    $sql->orderBy($order->column, $order->dir);
                }
            }
            if (Input::has('columns')) {
                foreach (json_decode(Input::get('columns')) as $col) {
                    $column = $col->data;
                    $val = $col->search;
                    if (in_array($column, $cols) && ($val != '')) {
                        $sql->where($column, 'LIKE', '%' . $val . '%');
                    }
                }
            }
        }

        try {
            $count = $sql->count();
            $data = Input::has('length')&&Input::get('length')!=0 ? 
                $sql->skip(Input::get('start'))->take(Input::get('length'))->get() : 
                $sql->get();
            $result = BF::dataTable($data, $count, $count, false);
        } catch (\Illuminate\Database\QueryException $e) {
            return BF::result(false, $e->getMessage());
        }

        return BF::result(true, $result, '[customer] get customers');
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
    }

    public function show($id)
    {
        try {
            $customer = Customer::find($id);
            return BF::result(true, ['customer' => $customer], '[customer] show');
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        try {
            $validator = Validator::make($data, [
                'first_name' => 'required|between:1,50', // not_exist is custom
                'hn' => 'numeric',
            ], BF::getErrorMessage()); // for convenience when needed to change error message in the future
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
            $customer = Customer::find($id)->update($data);
            return BF::result(true, [], '[customer] update');
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function destroy($id)
    {
    }

    public function getCustomerEvents($customer_id){
        $sql = Event::with('sale', 'slot.doctor.user', 'sub_category');
        $sql->where('sc_customer_id', '=', $customer_id);
        if (Input::has('order')) {
            foreach (json_decode(Input::get('order')) as $order) {
                $sql->orderBy($order->column, $order->dir);
            }
        }
        if (Input::has('columns')) {
            foreach (json_decode(Input::get('columns')) as $col) {
                $column = $col->data;
                $val = $col->search;
                if ($val != '') {
                    $sql->where($column, 'LIKE', '%' . $val . '%');
                }
            }
        }

        try {
            $count = $sql->count();
            $data = Input::has('length')&&Input::get('length')!=0 ? $sql->skip(Input::get('start'))->take(Input::get('length'))->get() : $sql->get();
            $result = BF::dataTable($data, $count, $count, false);
        } catch (\Illuminate\Database\QueryException $e) {
            return BF::result(false, $e->getMessage());
        }

        //dd(\DB::getQueryLog());

        return BF::result(true, $result, '[schedule] get customer events');

    }

}
