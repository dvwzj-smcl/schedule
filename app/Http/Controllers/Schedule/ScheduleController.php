<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Category;
use App\Models\Calendar\Slot;
use App\Models\Calendar\SubCategory;
use App\Models\User\Customer;
use App\Models\User\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;
use DB;
use Input;

class ScheduleController extends Controller
{
    public function init()
    {
        // todo: remove commented code
        $doctors = Doctor::with('user')->get()->keyBy('id');
        $categories = Category::with('sub_categories')->get()->keyBy('id');

        // lookup for SubCategory name (1)
        $nameLookup = static::getSubCategoryNames();

        foreach($doctors as $doctor) {
            $data = json_decode($doctor->data);

            // attach SubCategory name (2)
            foreach($data->categories as $category) {
                foreach($category->sub_categories as $sub) {
                    $sub->name = $nameLookup[$sub->category_id][$sub->sub_category_id];
                }
            }
            $doctor->categories = $data->categories;
            unset($doctor['data']);
        }
        $response = [
            'doctors' => $doctors,
            'categories' => $categories
        ];
        return BF::result(true, $response, '[schedule] init');
    }

    public function getDoctorSlots($doctor_id){
        // parse date
        if(empty(Input::get('date'))) $date = Carbon::now();
        else $date = Carbon::parse(Input::get('date'));

        $mode = Input::get('mode');
        $query = Slot::with('category')->where('sc_doctor_id', $doctor_id);
        if(empty($mode)) {
            $query->byDate($date);
        } else {
            if($mode == 'previous') $query->previous($date);
            else $query->next($date);
        }
        $slots = $query->get();
        $slots = array_map(function($slot){
            $slot['title'] = $slot['category']['name'];
            unset($slot['category']);
            return $slot;
        }, $slots->toArray());
        return BF::result(true, ['slots' => $slots], '[schedule] get slot');
    }
    
    public function getDoctorEvents($doctor_id){
        // parse date
        if(empty(Input::get('date'))) $date = Carbon::now();
        else $date = Carbon::parse(Input::get('date'));

        $mode = Input::get('mode');
        $query = Slot::with('category')->where('sc_doctor_id', $doctor_id);
        if(empty($mode)) {
            $query->byDate($date);
        } else {
            if($mode == 'previous') $query->previous($date);
            else $query->next($date);
        }
        $slots = $query->get();
        $events = [];
        $self_id = BF::getUserId();

        $nameLookup = static::getSubCategoryNames();

        foreach($slots as $slot) {
            $slot->title = $slot->category->name;
            foreach($slot->events as $event) {
                $customer = null;
                if($self_id == $event->sale_id) {
                    $customer = $event->customer->toArray();
                }
                $events[] = [
                    'start' => $event->start,
                    'end' => $event->end,
                    'sale_id' => $event->sale_id,
                    'slot_id' => $event->sc_slot_id,
                    'category_id' => $slot->category->id,
                    'sub_category_id' => $event->sc_sub_category_id,
                    'title' => $nameLookup[$slot->category->id][$event->sc_sub_category_id],
                    'customer' => $customer
                ];
            }
            unset($slot['category']);
            unset($slot['events']);
        }
        return BF::result(true, ['slots' => $slots, 'events' => $events], '[schedule] get slot');
    }

    // for internal use only
    private function getSubCategoryNames() {
        $categories = Category::with('sub_categories')->get();
        $categoryLookup = [];
        foreach($categories as $cat) {
            $names = [];
            foreach($cat->sub_categories as $sub) {
                $names[$sub->id] = $sub->name;
            }
            $categoryLookup[$cat->id] = $names;
        }
        return $categoryLookup;
    }

//    public function getDoctorSlots($doctor_id){
//        // parse date
//        if(empty(Input::get('date'))) $date = Carbon::now();
//        else $date = Carbon::parse(Input::get('date'));
//
//        $query = Slot::with('category')->where('sc_doctor_id', $doctor_id);
//
//        $mode = Input::get('mode');
//        if(empty($mode)) {
//            $query->byDate($date);
//        } else {
//            if($mode == 'previous') $query->previous($date);
//            else $query->next($date);
//        }
//        $slots = $query->get();
//
//        $slots = array_map(function($slot){
//            $slot['title'] = $slot['category']['name'];
//            unset($slot['category']);
//            return $slot;
//        }, $slots->toArray());
//
//        return BF::result(true, ['slots' => $slots], '[schedule] get slot');
//    }

    public function getCategorySlots($doctor_id){
        // todo: doing
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
