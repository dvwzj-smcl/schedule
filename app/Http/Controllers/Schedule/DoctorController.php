<?php

namespace App\Http\Controllers\Schedule;

use App\Models\User\Doctor;
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
            $doctor = Doctor::create($data);
            return BF::result(true, ['doctor' => $doctor]);
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
            $doctor = Doctor::find($id);
            if($doctor == null) throw new \Exception('Doctor not found!');
            $updateData = $request->all();
            // For Doctor Setting
            if($request->has('data')) {
                $newData = $updateData['data'];
                $cat_id = $newData['category_id'];
                $data = json_decode($doctor->data, true);
                $sub = [];
                foreach ($newData as $key => $value) {
                    $attr = explode('-', $key);
                    if(count($attr) == 2) {
                        if(!isset($sub[$attr[1]])) $sub[$attr[1]] = [];
                        $sub[$attr[1]][$attr[0]] = $value;
//                        $data['categories'][$cat_id]['sub_categories'][$attr[1]][$attr[0]] = $value;
                    }
                }
                $data['categories'][$cat_id]['color'] = $newData['color'];
                $data['categories'][$cat_id]['sub_categories'] = $sub;
                $updateData['data'] = json_encode($data);
            }
            $doctor->update($updateData);
            return BF::result(true, ['doctor' => $doctor]);
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
