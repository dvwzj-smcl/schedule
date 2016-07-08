<?php

use Illuminate\Database\Seeder;

class SubCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Calendar\SubCategory::create(['calendar_category_id'=>1, 'name'=>'ผ่าตัดหน้าอก']);
    }
}
