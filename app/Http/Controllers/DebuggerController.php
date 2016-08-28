<?php

namespace App\Http\Controllers;

use App\Models\Calendar\Event;
use App\Models\Calendar\Slot;
use App\Models\User\Doctor;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use BF;

use App\Http\Requests;

class DebuggerController extends Controller
{
    public function index()
    {
        // --- START Slot Delete
        try {
            $slot = \App\Models\Calendar\Slot::find(109);
            if($slot == null) throw new \Exception('Slot not found!');
            $slot->delete();
            return BF::result(true, ['slot' => $slot]);
        } catch(\Illuminate\Database\QueryException $e){
            return BF::result(false, $e->getMessage());
        } catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }

        // --- END  Slot Delete

        dd((new Carbon())->addDay(-1));
        $branch_id = 1;
        $sales = \App\Models\User\User::whereBranchId($branch_id)->sales()->get()->pluck('user_id');
        dd($sales[rand(1, count($sales) - 1)]);

        $sales = User::sales()->get();
        dd($sales->toArray());
        $data = json_decode(\App\Models\User\Doctor::find(1)->data, true);
        dd($data);
        $subs = array_values($data->categories); // reindex
        dd($subs);
        $slot = Slot::find(1);
        dd(Event::find(1)->doctor_sub_category->name->toArray());
        dd(User::sales()->get()->pluck('user_id'));
        
        dd(User::find(1)->getAllPermissions());

        // --- date time
        $date = Carbon::parse('2016-08-09T03:40:00.000Z', 'UTC')->setTimezone('Asia/Bangkok');
        dd($date);
        dd(Carbon::now());
    }
}
