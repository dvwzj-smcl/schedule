<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserModuleSeeder::class);
        $this->call(ScheduleModuleSeeder::class);
    }
}

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        

    }
}

class CalendarsTableSeeder extends Seeder
{
    public function run()
    {
        
    }
}