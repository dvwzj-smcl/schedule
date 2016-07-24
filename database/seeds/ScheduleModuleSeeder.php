<?php

use Illuminate\Database\Seeder;

class ScheduleModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User\Doctor::create(['color'=>'#ffffff', 'user_id'=>2]);
        \App\Models\User\Doctor::create(['color'=>'#ffffff', 'user_id'=>3]);
        \App\Models\User\Organizer::create(['user_id'=>4]);
        \App\Models\User\Organizer::create(['user_id'=>5]);
        \App\Models\User\Sale::create(['user_id'=>6]);
        \App\Models\User\Sale::create(['user_id'=>7]);
        \App\Models\User\Customer::create(['name'=>'Customer A', 'phone'=>'0987654321', 'contact'=>'htp://www.facebook.com/customera']);
        \App\Models\User\Customer::create(['name'=>'Customer B', 'phone'=>'0987654322', 'contact'=>'htp://www.facebook.com/customerb']);

        \App\Models\Calendar\Category::create(['name'=>'ผ่าตัด']);
        \App\Models\Calendar\Category::create(['name'=>'Consult']);
        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดหน้าอก', 'sc_category_id'=>1]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดจมูก', 'sc_category_id'=>1]);
        \App\Models\Calendar\SubCategory::create(['name'=>'อะไรสักอย่าง', 'sc_category_id'=>2]);

        \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>1,'sc_doctor_id'=>1]);
        \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>2,'sc_doctor_id'=>1]);
        \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>1,'sc_doctor_id'=>2]);
        \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>2,'sc_doctor_id'=>2]);
        \App\Models\Calendar\DoctorSubCategory::create(['duration'=>20, 'sc_sub_category_id'=>1,'sc_doctor_id'=>1]);
        \App\Models\Calendar\DoctorSubCategory::create(['duration'=>30, 'sc_sub_category_id'=>2,'sc_doctor_id'=>1]);
        \App\Models\Calendar\DoctorSubCategory::create(['duration'=>30, 'sc_sub_category_id'=>3,'sc_doctor_id'=>1]);
        \App\Models\Calendar\DoctorSubCategory::create(['duration'=>25, 'sc_sub_category_id'=>1,'sc_doctor_id'=>2]);
        \App\Models\Calendar\DoctorSubCategory::create(['duration'=>25, 'sc_sub_category_id'=>2,'sc_doctor_id'=>2]);
        \App\Models\Calendar\DoctorSubCategory::create(['duration'=>30, 'sc_sub_category_id'=>3,'sc_doctor_id'=>2]);

        \App\Models\Calendar\Slot::create(['start'=>'2016-07-12 08:00:00', 'end'=>'2016-07-12 12:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-12 13:00:00', 'end'=>'2016-07-12 17:00:00', 'sc_doctor_id'=>2, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-13 13:00:00', 'end'=>'2016-07-13 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>2, 'sc_category_id'=>2]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-09-13 13:00:00', 'end'=>'2016-09-13 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);

        \App\Models\Calendar\Slot::create(['start'=>'2016-07-25 08:00:00', 'end'=>'2016-07-12 12:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-25 14:00:00', 'end'=>'2016-07-12 15:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>2]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-25 15:00:00', 'end'=>'2016-07-12 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-26 08:00:00', 'end'=>'2016-07-12 12:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-26 14:00:00', 'end'=>'2016-07-12 15:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>2]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-26 15:00:00', 'end'=>'2016-07-12 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-27 10:00:00', 'end'=>'2016-07-12 12:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-27 14:00:00', 'end'=>'2016-07-12 16:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>2]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-28 08:00:00', 'end'=>'2016-07-12 12:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-28 14:00:00', 'end'=>'2016-07-12 15:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>2]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-28 15:00:00', 'end'=>'2016-07-12 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1, 'sc_category_id'=>1]);

        \App\Models\Calendar\Event::create(['sc_slot_id'=>1, 'sc_sub_category_id'=>1]);
        \App\Models\Calendar\Event::create(['sc_slot_id'=>1, 'sc_sub_category_id'=>1, 'sc_customer_id'=>1, 'sc_sale_id'=>2]);
        \App\Models\Calendar\Event::create(['sc_slot_id'=>1, 'sc_sub_category_id'=>2]);
        \App\Models\Calendar\Event::create(['sc_slot_id'=>2, 'sc_sub_category_id'=>2, 'sc_customer_id'=>2, 'sc_sale_id'=>1]);
        \App\Models\Calendar\Event::create(['sc_slot_id'=>2, 'sc_sub_category_id'=>2]);
        \App\Models\Calendar\Event::create(['sc_slot_id'=>2, 'sc_sub_category_id'=>1]);

        /*
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-12 08:00:00', 'end'=>'2016-07-12 12:00:00', 'doctor_id'=>1, 'organizer_id'=>1]);



        \App\Models\Calendar\CategorySlot::create(['calendar_slot_id'=>1, 'calendar_category_id'=>1]);
        \App\Models\Calendar\DoctorSubCategory::create(['calendar_subcat_id'=>1, 'doctor_id'=>1, 'duration'=>20]);

        \App\Models\Calendar\Event::create(['calendar_slot_id'=>1, 'sale_id'=>1, 'customer_id'=>1]);
        \App\Models\Calendar\Event::create(['calendar_slot_id'=>1, 'sale_id'=>1, 'customer_id'=>2]);
        */
    }
}
