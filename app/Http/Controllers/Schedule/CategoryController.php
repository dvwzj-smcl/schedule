<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Category;
use App\Models\User\Doctor;
use Illuminate\Http\Request;
use BF;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
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
                'duration' => $request->get('doctor_id')
            ];
            $cat = Category::create($data);
            return BF::result(true, ['category' => $cat]);
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
            $cat = Category::find($id);
            if($cat == null) throw new \Exception('Category not found!');
            $cat->update($request->all());
            return BF::result(true, ['category' => $cat]);
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $cat = Category::find($id);
            if($cat == null) throw new \Exception('Category not found!');
            $cat->delete();
            return BF::result(true, ['category' => $cat]);
        } catch (\Illuminate\Database\QueryException $e){
            return BF::result(false, 'Cannot delete this category. Category in use.');
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }
}
