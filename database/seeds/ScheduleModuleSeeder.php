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
        $doctors = [];
        $sales = [];
        $organizers = [];

        $users = \App\Models\User\User::with('roles')->get();
        foreach($users as $user) {
            if($user->hasRole('doctor')) {
                $doctor = \App\Models\User\Doctor::create(['color'=>'#ffffff', 'user_id'=>$user->id]);
                $doctors[] = $doctor->id;
            } else if($user->hasRole('sale')) {
                $sale = \App\Models\User\Sale::create(['user_id'=>$user->id]);
                $sales[] = $sale->id;
            } else if($user->hasRole('organizer')) {
                $organizer = \App\Models\User\Organizer::create(['user_id'=>$user->id]);
                $organizers[] = $organizer->id;
            }
        }

        \App\Models\User\Customer::create(['name'=>'Customer A', 'phone'=>'0987654321', 'contact'=>'htp://www.facebook.com/customera']);
        \App\Models\User\Customer::create(['name'=>'Customer B', 'phone'=>'0987654322', 'contact'=>'htp://www.facebook.com/customerb']);

        \App\Models\Calendar\Category::create(['name'=>'ผ่าตัด']);
        \App\Models\Calendar\Category::create(['name'=>'Consult & Followup']);

        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดหน้าอก', 'sc_category_id'=>1]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดจมูก', 'sc_category_id'=>1]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดปาก', 'sc_category_id'=>1]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ดูดไขมัน', 'sc_category_id'=>1]);

        \App\Models\Calendar\SubCategory::create(['name'=>'ปรึกษาตา', 'sc_category_id'=>2]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ปรึกษาจมูก', 'sc_category_id'=>2]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ปรึกษาปาก', 'sc_category_id'=>2]);
        \App\Models\Calendar\SubCategory::create(['name'=>'follow-up ตา', 'sc_category_id'=>2]);
        \App\Models\Calendar\SubCategory::create(['name'=>'follow-up จมูก', 'sc_category_id'=>2]);
        \App\Models\Calendar\SubCategory::create(['name'=>'follow-up ปาก', 'sc_category_id'=>2]);


        foreach($doctors as $id) {

            // Set Colors (#9A9CFF, #42D692, #4986E7, #CCA6AC)
            \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>1,'sc_doctor_id'=>$id,'color'=>'#9A9CFF']);
            \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>2,'sc_doctor_id'=>$id,'color'=>'#42D692']);

            // Set Durations
            $i = 1;
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>30, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>35, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);

            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>15, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>15, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>15, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>10, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>10, 'sc_sub_category_id'=>$i++,'sc_doctor_id'=>$id]);
            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>10, 'sc_sub_category_id'=>$i,'sc_doctor_id'=>$id]);
        }

        // Generate sample slots

        $current = \Carbon\Carbon::create(2016, 4, 1);
        $limit = \Carbon\Carbon::create(2016, 12, 31);
        while($current < $limit) {
            foreach($doctors as $id) {
                $start = clone $current;
                $end = clone $current;
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(8, 0), 'end' => $end->setTime(12, 0), 'sc_doctor_id' => $id, 'sc_organizer_id' => 1, 'sc_category_id' => 1]);
               
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(14, 0), 'end' => $end->setTime(15, 0), 'sc_doctor_id' => $id, 'sc_organizer_id' => 1, 'sc_category_id' => 2]);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(15, 0), 'end' => $end->setTime(17, 0), 'sc_doctor_id' => $id, 'sc_organizer_id' => 1, 'sc_category_id' => 1]);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(17, 0), 'end' => $end->setTime(20, 0), 'sc_doctor_id' => $id, 'sc_organizer_id' => 1, 'sc_category_id' => 2]);
            }
            $current->addDay();
        }

        // Generate sample events

//        while($current < $limit) {
//            foreach($current < limit)
//        }

//        \App\Models\Calendar\Event::create(['sc_slot_id'=>1, 'sc_sub_category_id'=>1]);
//        \App\Models\Calendar\Event::create(['sc_slot_id'=>1, 'sc_sub_category_id'=>1, 'sc_customer_id'=>1, 'sc_sale_id'=>2]);
//        \App\Models\Calendar\Event::create(['sc_slot_id'=>1, 'sc_sub_category_id'=>2]);
//        \App\Models\Calendar\Event::create(['sc_slot_id'=>2, 'sc_sub_category_id'=>2, 'sc_customer_id'=>2, 'sc_sale_id'=>1]);
//        \App\Models\Calendar\Event::create(['sc_slot_id'=>2, 'sc_sub_category_id'=>2]);
//        \App\Models\Calendar\Event::create(['sc_slot_id'=>2, 'sc_sub_category_id'=>1]);

        /*
        \App\Models\Calendar\Slot::create(['start'=>'2016-08-12 08:00:00', 'end'=>'2016-08-12 12:00:00', 'doctor_id'=>1, 'organizer_id'=>1]);



        \App\Models\Calendar\CategorySlot::create(['calendar_slot_id'=>1, 'calendar_category_id'=>1]);
        \App\Models\Calendar\DoctorSubCategory::create(['calendar_subcat_id'=>1, 'doctor_id'=>1, 'duration'=>20]);

        \App\Models\Calendar\Event::create(['calendar_slot_id'=>1, 'sale_id'=>1, 'customer_id'=>1]);
        \App\Models\Calendar\Event::create(['calendar_slot_id'=>1, 'sale_id'=>1, 'customer_id'=>2]);
        */
    }

    public function fillEvent(\App\Models\Calendar\Slot $slot) {
        $subcats = \App\Models\Calendar\Category::find($slot->category->id)->sub_categories;
        $maxId = count($subcats) - 1;
        $isFull = false;
        $slotTime = 100; // todo:
        while(!$isFull) {
            $subcat = rand(0, $maxId);
            $
            $category = find();
        }
    }
}
