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
        $colors = ['#C22326','#F37338','#027878','#FDB632','#801638','#2B80B9'];
        $doctors = [];
        $sales = [];
        $organizers = [];

        \App\Models\Calendar\Category::create(['name'=>'ผ่าตัด', 'color'=>'#9A9CFF']);
        \App\Models\Calendar\Category::create(['name'=>'Consult & Followup', 'color'=>'#FFAD46']);

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
        // Generate JSON data
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
                            'enable' => true,
                        ];
                    }
                    $data['categories'][$cat->id] = [
                        'color' => $cat->color,
                        'sub_categories' => $sub_categories
                    ];
                    // $subcats = $category->sub_categories()->get()->keyBy('sc_sub_category_id');
                }
                $doctor = \App\Models\User\Doctor::create(['color'=>$colors[$user->id%(count($colors))], 'data'=> json_encode($data), 'user_id'=>$user->id]);
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
            \App\Models\User\Customer::create(['first_name' => "Customer {$id}", 'last_name' => "Customer {$id}", 'hn'=>"{$hn}", 'phone'=>"020000000", 'contact'=>"http://www.facebook.com/customer{$id}"]);
        }

        // Generate sample slots

        $current = \Carbon\Carbon::create(2016, 8, 20);
        $limit = \Carbon\Carbon::create(2016, 10, 31);
        $created_by = $organizers[rand(0, count($organizers) - 1)];
        while($current < $limit) {
            foreach($doctors as $id) {
                $start = clone $current;
                $end = clone $current;
                $slot = \App\Models\Calendar\Slot::create(['start' => $start->setTime(8, 0), 'end' => $end->setTime(12, 0), 'sc_doctor_id' => $id, 'created_by' => $created_by, 'sc_category_id' => 1]);
                static::randomFillEvents($slot);
                $slot = \App\Models\Calendar\Slot::create(['start' => $start->setTime(14, 0), 'end' => $end->setTime(15, 0), 'sc_doctor_id' => $id, 'created_by' => $created_by, 'sc_category_id' => 2]);
                static::randomFillEvents($slot);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(15, 0), 'end' => $end->setTime(17, 0), 'sc_doctor_id' => $id, 'created_by' => $created_by, 'sc_category_id' => 1]);
                \App\Models\Calendar\Slot::create(['start' => $start->setTime(17, 0), 'end' => $end->setTime(20, 0), 'sc_doctor_id' => $id, 'created_by' => $created_by, 'sc_category_id' => 2]);
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
        $today = \Carbon\Carbon::now();
        $callDay = $today->copy()->addDay(7);
        $messageDay = $today->copy()->addDay(3);
        while($time < $limit) {
            $sub = $subs[rand(0, $maxId)];
            $end = clone $time;
            $end->addMinute($sub['duration']);
            $reason = '';
            $status = ($time < $today) ? 'approved' : static::getRandomStatus();
            if($status == 'approved') {
            } else if($status == 'rejected') {
                if(rand(0, 100) < 50) $reason = 'reject reason';
            } else if($status == 'canceled') {
                if(rand(0, 100) < 50) $reason = 'cancel reason';
            }
            $contactStatus = ['called_at' => null, 'messaged_at' => null, 'confirmed_at' => null];
            if($time < $callDay && $status == 'approved') {
                if($time < $messageDay) {
                    $contactStatus = [
                        'called_at' => (rand(0,10) < 8) ? $today->copy()->addDays(-3) : null,
                        'messaged_at' => (rand(0,10) < 8) ? $today->copy()->addDays(-1) : null,
                        'confirmed_at' => (rand(0,10) < 3) ? $today->copy()->addDays(-2) : null,
                    ];
                } else {
                    $contactStatus = [
                        'called_at' => (rand(0,10) < 3) ? $today->copy()->addDays(-3) : null,
                        'messaged_at' => (rand(0,10) < 3) ? $today->copy()->addDays(-1) : null,
                        'confirmed_at' => (rand(0,10) < 1) ? $today->copy()->addDays(-2) : null,
                    ];
                }
            }
            if($end > $limit) break;
            if(rand(0, 100) > 20) {
                \App\Models\Calendar\Event::create(array_merge(
                    ['start'=>$time, 'end'=>$end, 'sc_slot_id'=>$slot->id, 'sc_sub_category_id'=>$sub['sub_category_id'], 'sale_id'=>static::getRandomSaleId($slot), 'sc_customer_id'=>rand(1, \App\Models\User\Customer::count()), 'status'=>$status],
                    $contactStatus
                ));
            }
            $time->addMinute($sub['duration']);
        }
    }

    public function getRandomStatus() {
        $status = ['rejected', 'canceled', 'pending'];
        if(rand(0, 10) < 9) return 'approved';
        return $status[rand(0,count($status)-1)];
    }

    // old
    public function getRandomConfirmStatus($time) {
        $status = ['', ' done phoned', 'phoned', 'messaged', 'done messaged', 'failed'];
        $today = \Carbon\Carbon::now();
        $phoneDay = (new \Carbon\Carbon())->addDay(-3);
        $messageDay = (new \Carbon\Carbon())->addDay(-3);
        if($phoneDay < $time && $time < $today) {
            if(rand(0, 100) < 50) {
                if($messageDay < $time && $time < $today) {
                    if(rand(0, 100) < 50) {
                        return 'done messaged';
                    }
                    return 'messaged';
                }
                return 'phoned';
            }
            if($time < $messageDay) return 'done phoned';
            return '';
        } else if($time < $today) {
            return $status[rand(0,count($status)-1)];
        }
        return '';
    }

    public function getRandomSaleId(\App\Models\Calendar\Slot $slot) {
        $branch_id = $slot->doctor->user->branch_id;
        $sales = \App\Models\User\User::whereBranchId($branch_id)->sales()->get()->pluck('user_id');
        return $sales[rand(0, count($sales) - 1)];
    }
}
