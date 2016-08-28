<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Doctor;
use Illuminate\Http\Request;
use BF;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class DoctorController extends Controller
{
    public function index()
    {
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
        try {
            $data = [
                'name' => $request->get('name'),
                'user_id' => $request->get('user_id'),
                'color' => $request->get('color'),
                'data' => $request->get('data'),
            ];
            $sub = Doctor::create($data);
            return BF::result(true, ['doctor' => $sub]);
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function show($id)
    {
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
        try {
            $sub = Doctor::find($id);
            if($sub == null) throw new \Exception('Doctor not found!');
            $sub->update($request->all());
            return BF::result(true, ['doctor' => $sub]);
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $doctor = Doctor::find($id);
            if($doctor == null) throw new \Exception('Doctor not found!');
            $doctor->delete();
            return BF::result(true, ['doctor' => $doctor]);
        } catch (\Illuminate\Database\QueryException $e){
            return BF::result(false, 'Cannot delete this doctor. There are appointments with this doctor.');
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }
}
