<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\SubCategory;
use App\Models\User\Doctor;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SubcategoryController extends Controller
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
                'duration' => $request->get('doctor_id'),
                'sc_category_id' => $request->get('category_id'),
            ];
            $sub = SubCategory::create($data);
            return BF::result(true, ['subcategory' => $sub]);
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
            $sub = SubCategory::find($id);
            if($sub == null) throw new \Exception('Subcategory not found!');
            $sub->update($request->all());
            return BF::result(true, ['subcategory' => $sub]);
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $sub = SubCategory::find($id);
            if($sub == null) throw new \Exception('Subcategory not found!');
            $sub->delete();
            return BF::result(true, ['subcategory' => $sub]);
        } catch (\Illuminate\Database\QueryException $e){
            return BF::result(false, 'Cannot delete this subcategory. There are appointments with this subcategory.');
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function saveSubcategories(Request $request, $doctor_id)
    {
        try {
            $doctor = Doctor::find($doctor_id);
            if($doctor == null) throw new \Exception('Doctor not found!');
            $doctor->update($request->all());
            return BF::result(true, ['subcategory' => $doctor]);
        } catch (\Illuminate\Database\QueryException $e){
            return BF::result(false, 'Cannot delete this subcategory. There are appointments with this subcategory.');
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }
}
