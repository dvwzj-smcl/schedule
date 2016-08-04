<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Slot;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Firebase\JWT\JWT;
use BF;
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
        $access_token = $request->header('access-token');
        $user = JWT::decode($access_token, env('APP_KEY'), ['HS256']);
        $organizer = \App\Models\User\Organizer::where('user_id', $user->id)->first();
        $data = [
            'sc_organizer_id' => $organizer->id,
            'sc_doctor_id' => $request->get('doctor_id'),
            'sc_category_id' => $request->get('category_id'),
            'start' => $request->get('start'),
            'end' => $request->get('end')
        ];
        try {
            \App\Models\Calendar\Slot::create($data);
            $slots = \App\Models\User\Doctor::with('slots.category')->find($request->get('doctor_id'))->slots;
            $slots = array_map(function ($slot) {
                $slot['title'] = $slot['category']['name'];
                unset($slot['category']);
                return $slot;
            }, $slots->toArray());
            return BF::result(true, ['slots' => $slots]);
        }catch(\Exception $e){
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
            \App\Models\Calendar\Slot::find($id)->update($request->all());
            $slots = \App\Models\User\Doctor::with('slots.category')->find($request->get('sc_doctor_id'))->slots;
            $slots = array_map(function ($slot) {
                $slot['title'] = $slot['category']['name'];
                unset($slot['category']);
                return $slot;
            }, $slots->toArray());
            return BF::result(true, ['slots' => $slots]);
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
            $slot = \App\Models\Calendar\Slot::find($id);
            $slot->delete();
            $slots = \App\Models\User\Doctor::with('slots.category')->find($slot->sc_doctor_id)->slots;
            $slots = array_map(function ($slot) {
                $slot['title'] = $slot['category']['name'];
                unset($slot['category']);
                return $slot;
            }, $slots->toArray());
            return BF::result(true, ['slots' => $slots]);
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }
    
    public function addEvent($slot_id) {
        try {
            $slot = Slot::find($slot_id);
            if($slot == null) throw new \Exception('Slot not found');
            // todo: check slot full
            return BF::result(true, ['slots' => $slot]);
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }

        // not full
        // full
    }
}
