<?php

namespace App\Http\Controllers;

use App\Models\User\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class DebuggerController extends Controller
{
    public function index()
    {
        dd(User::find(1)->getAllPermissions());
    }
}
