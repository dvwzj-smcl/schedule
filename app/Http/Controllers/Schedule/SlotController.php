<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Event;
use App\Models\Calendar\Slot;
use App\Models\Calendar\SubCategory;
use App\Models\User\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Firebase\JWT\JWT;
use BF;
use Input;
use Mockery\CountValidator\Exception;

class SlotController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $data = [
                'created_by' => BF::getUserId(),
                'sc_doctor_id' => $request->get('doctor_id'),
                'sc_category_id' => $request->get('category_id'),
                'start' => $request->get('start'),
                'end' => $request->get('end')
            ];
            $slot = Slot::create($data);
            return BF::result(true, ['slot' => $slot]);
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $slot = Slot::find($id);
            if($slot == null) throw new \Exception('Slot not found!');
            $slot->update($request->all());
            return BF::result(true, ['slot' => $slot]);
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $slot = Slot::find($id);
            if($slot == null) throw new \Exception('Slot not found!');
            $slot->delete();
            return BF::result(true, ['slot' => $slot]);
        } catch (\Illuminate\Database\QueryException $e){
            return BF::result(false, 'Slot is not empty!');
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }
}
