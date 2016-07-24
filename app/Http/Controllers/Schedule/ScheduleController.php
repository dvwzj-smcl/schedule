<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Category;
use App\Models\User\Doctor;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;

class ScheduleController extends Controller
{
    public function getInit()
    {
        $res = [
            'doctors' => Doctor::with('user')->get(),
            'categories' => Category::with('sub_categories')->get(),
        ];
        return BF::result(true, $res, '[schedule] init');
    }
}
