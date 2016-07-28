<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Category;
use App\Models\User\Doctor;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;
use DB;

class ScheduleController extends Controller
{
    public function getInit()
    {
        $colorData = DB::table('sc_doctor_categories')->get();
        $colors = [];
        foreach($colorData as $color) {
//            dd($color);
            $colors[$color->sc_doctor_id][$color->sc_category_id] = $color->color;
        }
        $res = [
            'doctors' => Doctor::with('user')->get(),
            'categories' => Category::with('sub_categories')->get(),
            'colors' => $colors,
        ];
        return BF::result(true, $res, '[schedule] init');
    }
}
