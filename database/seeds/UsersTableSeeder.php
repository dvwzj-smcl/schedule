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
    }
}
