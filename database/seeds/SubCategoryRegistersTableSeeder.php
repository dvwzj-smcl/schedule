<?php

use Illuminate\Database\Seeder;

class SubCategoryRegistersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Calendar\SubCategoryRegister::create(['calendar_sub_category_id'=>1, 'user_doctor_id'=>1]);
    }
}
