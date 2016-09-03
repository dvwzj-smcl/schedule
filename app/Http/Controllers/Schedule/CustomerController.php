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
        return BF::getDataTable(Customer::query(), 'customer');
        /*// original
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

        return BF::result(true, $result, '[customer] get customers');*/
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
            return BF::result(true, $customer);
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
        return BF::update([
            'model' => 'user',
            'action' => function($data) use ($id) {
                $customer = Customer::find($id)->update($data);
                return $customer;
            },
            'validator' => [
                'first_name' => 'required|between:1,50', // not_exist is custom
                'hn' => 'numeric',
            ]
        ]);
    }

    public function destroy($id)
    {
    }

    public function getCustomerEvents($customer_id)
    {
        return BF::getDataTable(Event::with('sale', 'slot.doctor.user', 'sub_category')->where('sc_customer_id', '=', $customer_id), 'customer');
    }

}
