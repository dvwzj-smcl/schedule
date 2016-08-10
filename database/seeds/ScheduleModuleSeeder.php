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

        \App\Models\Calendar\Category::create(['name'=>'ผ่าตัด', 'color'=>'#9A9CFF']);
        \App\Models\Calendar\Category::create(['name'=>'Consult & Followup', 'color'=>'#42D692']);

        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดหน้าอก', 'sc_category_id'=>1, 'duration'=>30]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดจมูก', 'sc_category_id'=>1, 'duration'=>60]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ผ่าตัดปาก', 'sc_category_id'=>1, 'duration'=>80]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ดูดไขมัน', 'sc_category_id'=>1, 'duration'=>120]);

        \App\Models\Calendar\SubCategory::create(['name'=>'ปรึกษาตา', 'sc_category_id'=>2, 'duration'=>20]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ปรึกษาจมูก', 'sc_category_id'=>2, 'duration'=>20]);
        \App\Models\Calendar\SubCategory::create(['name'=>'ปรึกษาปาก', 'sc_category_id'=>2, 'duration'=>20]);
        \App\Models\Calendar\SubCategory::create(['name'=>'follow-up ตา', 'sc_category_id'=>2, 'duration'=>10]);
        \App\Models\Calendar\SubCategory::create(['name'=>'follow-up จมูก', 'sc_category_id'=>2, 'duration'=>10]);
        \App\Models\Calendar\SubCategory::create(['name'=>'follow-up ปาก', 'sc_category_id'=>2, 'duration'=>10]);
        
        $category_data = \App\Models\Calendar\Category::get();

        $users = \App\Models\User\User::with('roles')->get();
        foreach($users as $user) {
            if($user->hasRole('doctor')) {
                $data = ['categories'=>[]];
                foreach($category_data as $cat) {
                    $sub_categories = [];
                    foreach($cat->sub_categories as $sub) {
                        $sub_categories[$sub->id] = [
                            'category_id' => $cat->id,
                            'sub_category_id' => $sub->id,
                            'duration' => $sub->duration,
                        ];
                    }
                    $data['categories'][$cat->id] = [
                        'color' => $cat->color,
                        'sub_categories' => $sub_categories
                    ];
                    // $subcats = $category->sub_categories()->get()->keyBy('sc_sub_category_id');
                }
                $doctor = \App\Models\User\Doctor::create(['color'=>'#ffffff', 'data'=> json_encode($data), 'user_id'=>$user->id]);
                $doctors[] = $doctor->id;
            } else if($user->hasRole('sale')) {
                $sales[] = $user->id;
            } else if($user->hasRole('organizer')) {
                $organizers[] = $user->id;
            }
        }

        $customer_count = 100;
        for ($id = 1; $id <= $customer_count; $id++) {
            $hn = 5500000+$id;
            \App\Models\User\Customer::create(['first_name' => "Customer {$id}", 'last_name' => "Customer {$id}", 'hn'=>"{$hn}", 'phone'=>"020000000", 'contact'=>"htp://www.facebook.com/customer{$id}"]);
        }


//        foreach($doctors as $id) {
//
//            // Set Colors (#9A9CFF, #42D692, #4986E7, #CCA6AC)
//            $dcId1 = \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>1,'sc_doctor_id'=>$id,'color'=>'#9A9CFF'])->id;
//            $dcId2 = \App\Models\Calendar\DoctorCategory::create(['sc_category_id'=>2,'sc_doctor_id'=>$id,'color'=>'#42D692'])->id;
//
//            // Set Durations
//            $i = 1;
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>30, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId1]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>60, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId1]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>80, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId1]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>120, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId1]);
//
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>20, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId2]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>20, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId2]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>20, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId2]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>10, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId2]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>10, 'sc_sub_category_id'=>$i++, 'sc_doctor_category_id'=>$dcId2]);
//            \App\Models\Calendar\DoctorSubCategory::create(['duration'=>10, 'sc_sub_category_id'=>$i, 'sc_doctor_category_id'=>$dcId2]);
//
//        }

        // Generate sample slots

        $current = \Carbon\Carbon::create(2016, 4, 1);
        $limit = \Carbon\Carbon::create(2016, 12, 31);
        while($current < $limit) {
            foreach($doctors as $id) {
                $start = clone $current;
                $end = clone $current;
                $slot = \App\Models\Calendar\Slot::create(['start' => $start->setTime(8, 0), 'end' => $end->setTime(12, 0), 'sc_doctor_id' => $id, 'created_by' => 1, 'sc_category_id' => 1]);
                static::randomFillEvents($slot);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(14, 0), 'end' => $end->setTime(15, 0), 'sc_doctor_id' => $id, 'created_by' => 1, 'sc_category_id' => 2]);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(15, 0), 'end' => $end->setTime(17, 0), 'sc_doctor_id' => $id, 'created_by' => 1, 'sc_category_id' => 1]);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(17, 0), 'end' => $end->setTime(20, 0), 'sc_doctor_id' => $id, 'created_by' => 1, 'sc_category_id' => 2]);
            }
            $current->addDay();
        }
    }

    public function randomFillEvents(\App\Models\Calendar\Slot $slot) {
        $data = json_decode(\App\Models\User\Doctor::find($slot->sc_doctor_id)->data, true);
        $subs = array_values($data['categories'][$slot->sc_category_id]['sub_categories']); // reindex
        $maxId = count($subs) - 1;
        $time = $slot->start;
        $limit = $slot->end;
        while($time < $limit) {
            $sub = $subs[rand(0, $maxId)];
            $end = clone $time;
            $end->addMinute($sub['duration']);
            if($end > $limit) break;
            if (rand(0, 100) > 20) {
                \App\Models\Calendar\Event::create(['start'=>$time, 'end'=>$end, 'sc_slot_id'=>$slot->id, 'sc_sub_category_id'=>$sub['sub_category_id'], 'sale_id'=>rand(1, static::getRandomSaleId($slot)), 'sc_customer_id'=>rand(1, \App\Models\User\Customer::count()), 'status'=>1]);
            }
            $time->addMinute($sub['duration']);
        }
    }

    public function getRandomSaleId(\App\Models\Calendar\Slot $slot) {
        $branch_id = $slot->doctor->user->branch_id;
        $sales = \App\Models\User\User::whereBranchId($branch_id)->sales()->get()->pluck('user_id');
        return $sales[rand(1, count($sales) - 1)];
    }
}
