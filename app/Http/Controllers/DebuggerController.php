<?php

namespace App\Http\Controllers;

use App\Models\Calendar\Event;
use App\Models\Calendar\Slot;
use App\Models\User\Doctor;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;

class DebuggerController extends Controller
{
    public function index()
    {
//        $slots = Slot::with('category', 'events')->previous(Carbon::now())->get();
//        dd($slots->toArray());
        $data = json_decode(\App\Models\User\Doctor::find(1)->data, true);
        dd($data);
        $subs = array_values($data->categories); // reindex
        dd($subs);
        $slot = Slot::find(1);
        dd(Event::find(1)->doctor_sub_category->name->toArray());
        $sc_doctor_category_id = \App\Models\Calendar\DoctorCategory::where('sc_doctor_id', $slot->sc_doctor_id)->where('sc_category_id', $slot->category->sc_category_id)->first();
//        $subcategories = \App\Models\Calendar\DoctorSubCategory::where('sc_doctor_category_id', $sc_doctor_category_id)->get();
//        dd($slot->category->id);
        dd(User::sales()->get()->pluck('user_id'));
        
        dd(User::find(1)->getAllPermissions());
    }
}
