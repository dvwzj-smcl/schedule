<?php

namespace App\Http\Controllers\Schedule;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Firebase\JWT\JWT;
use BF;

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
    public function create(Request $request)
    {
        $data = $request->all();
        $access_token = $request->headers('access-token');
        $user = JWT::decode($access_token, env('APP_KEY'));
        dd($user);
        //return BF::result(false, $e->getMessage());
        /*
        $data['sc_organizer_id'] = Auth::user()->id;
        \App\Models\Calendar\Slot::create($data);
        $slots = \App\Models\Calendar\Slot::where('sc_doctor_id', $request->doctor_id)->with('category')->get();
        $slots = array_map(function($slot){
            $slot['title'] = $slot['category']['name'];
            unset($slot['category']);
            return $slot;
        }, $slots->toArray());
        return response()->json(['slots'=>$slots], 200, array(), JSON_PRETTY_PRINT);
        */
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
