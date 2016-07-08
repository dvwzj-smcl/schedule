<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User\User::create(['name'=>'Admin', 'username'=>'admin', 'email'=>'admin@localhsot', 'password'=>bcrypt('password')]);
        \App\Models\User\User::create(['name'=>'Customer', 'username'=>'customer', 'email'=>'customer@localhsot', 'password'=>bcrypt('password')]);
        \App\Models\User\User::create(['name'=>'Doctor', 'username'=>'doctor', 'email'=>'doctor@localhsot', 'password'=>bcrypt('password')]);
        \App\Models\User\User::create(['name'=>'Middleman', 'username'=>'middleman', 'email'=>'middle@localhsot', 'password'=>bcrypt('password')]);
        \App\Models\User\User::create(['name'=>'Sale', 'username'=>'sale', 'email'=>'sale@localhsot', 'password'=>bcrypt('password')]);
    }
}
