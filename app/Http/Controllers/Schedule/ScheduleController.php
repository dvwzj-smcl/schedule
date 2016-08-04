<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Category;
use App\Models\Calendar\Slot;
use App\Models\User\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;
use DB;

class ScheduleController extends Controller
{
    public function init()
    {
        $colors = DB::table('sc_doctor_categories')->get();
        $categories = Category::with('sub_categories')->get();
        $colorLookup = [];
        foreach($colors as $color) {
            $colorLookup[$color->sc_doctor_id][$color->sc_category_id] = $color->color;
        }
        $categoryLookup = [];
        foreach($categories as $index => $cat) {
            $categoryLookup[$cat->id] = $index;
        }
        $res = [
            'doctors' => Doctor::with('user')->get(),
            'categories' => $categories,
            'lookup' => [ // lookup tables. transform object's id to array's id
                'colors' => $colorLookup,
                'categories' => $categoryLookup,
            ]
        ];
        return BF::result(true, $res, '[schedule] init');
    }

    /**
     * @param $request, $doctor_id
     * @return array
     * Get slot by doctor_id
     */
    public function getSlots($doctor_id){
        // $slots = Doctor::with('slots.category')->find($doctor_id)->slots;
        $slots = Slot::with('category')
            ->where('sc_doctor_id', $doctor_id)
            ->where('start', '<', Carbon::now()->addMonth())
            ->where('start', '>', Carbon::now()->addMonth(-1))
            ->get();
        $slots = array_map(function($slot){
            $slot['title'] = $slot['category']['name'];
            unset($slot['category']);
            return $slot;
        }, $slots->toArray());
        return BF::result(true, ['slots' => $slots], '[schedule] get slot');
    }
}
