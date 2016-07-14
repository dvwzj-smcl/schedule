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
        $this->call(UsersTableSeeder::class);
        $this->call(CalendarsTableSeeder::class);
    }
}

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $role_admin = \App\Models\User\Role::create(['name'=>'admin', 'display_name'=>'User Administrator', 'description'=>'User is allowed to manage and edit other users']);
        $role_doctor = \App\Models\User\Role::create(['name'=>'doctor', 'display_name'=>'User Doctor', 'description'=>'Just a doctor role']);
        $role_organizer = \App\Models\User\Role::create(['name'=>'organizer', 'display_name'=>'User Organizer', 'description'=>'Just a organizer role']);
        $role_sale = \App\Models\User\Role::create(['name'=>'sale', 'display_name'=>'User Sale', 'description'=>'Just a sale role']);

        $permission_manage_users = \App\Models\User\Permission::create(['name'=>'manage-users', 'display_name'=>'Manage Users', 'description'=>'Give a permission to manage users account']);
        $permission_event_setting = \App\Models\User\Permission::create(['name'=>'event-setting', 'display_name'=>'Setting Event', 'description'=>'Give a permission to setting an event']);
        $permission_event_assign = \App\Models\User\Permission::create(['name'=>'event-assign', 'display_name'=>'Assign Event', 'description'=>'Give a permission to assign event into calendar']);
        $permission_event_submit = \App\Models\User\Permission::create(['name'=>'event-submit', 'display_name'=>'Submit Event', 'description'=>'Give a permission to submit an event']);
        $permission_event_request = \App\Models\User\Permission::create(['name'=>'event-request', 'display_name'=>'Request Event', 'description'=>'Give a permission to request an event']);

        $user_admin = \App\Models\User\User::create(['name'=>'Admin', 'username'=>'admin', 'email'=>'admin@localhost', 'password'=>bcrypt('password')]);
        $user_doctor_a = \App\Models\User\User::create(['name'=>'Doctor A', 'username'=>'doctora', 'email'=>'doctora@localhost', 'password'=>bcrypt('password')]);
        $user_doctor_b = \App\Models\User\User::create(['name'=>'Doctor B', 'username'=>'doctorb', 'email'=>'doctorb@localhost', 'password'=>bcrypt('password')]);
        $user_organizer_a = \App\Models\User\User::create(['name'=>'Organizer A', 'username'=>'organizera', 'email'=>'organizera@localhost', 'password'=>bcrypt('password')]);
        $user_organizer_b = \App\Models\User\User::create(['name'=>'Organizer B', 'username'=>'organizerb', 'email'=>'organizerb@localhost', 'password'=>bcrypt('password')]);
        $user_sale_a = \App\Models\User\User::create(['name'=>'Sale A', 'username'=>'salea', 'email'=>'salea@localhost', 'password'=>bcrypt('password')]);
        $user_sale_b = \App\Models\User\User::create(['name'=>'Sale B', 'username'=>'saleb', 'email'=>'saleb@localhost', 'password'=>bcrypt('password')]);

        $user_admin->attachRole($role_admin);
        $user_doctor_a->attachRole($role_doctor);
        $user_doctor_b->attachRole($role_doctor);
        $user_organizer_a->attachRole($role_organizer);
        $user_organizer_b->attachRole($role_organizer);
        $user_sale_a->attachRole($role_sale);
        $user_sale_b->attachRole($role_sale);

        $role_admin->attachPermission($permission_manage_users);
        $role_doctor->attachPermission($permission_event_setting);
        $role_organizer->attachPermission($permission_event_assign);
        $role_sale->attachPermission($permission_event_submit);
        $role_sale->attachPermission($permission_event_request);

    }
}

class CalendarsTableSeeder extends Seeder
{
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

        \App\Models\Calendar\Slot::create(['start'=>'2016-07-12 08:00:00', 'end'=>'2016-07-12 12:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-12 13:00:00', 'end'=>'2016-07-12 17:00:00', 'sc_doctor_id'=>2, 'sc_organizer_id'=>1]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-07-13 13:00:00', 'end'=>'2016-07-13 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>2]);
        \App\Models\Calendar\Slot::create(['start'=>'2016-09-13 13:00:00', 'end'=>'2016-09-13 17:00:00', 'sc_doctor_id'=>1, 'sc_organizer_id'=>1]);

        \App\Models\Calendar\SlotCategory::create(['sc_slot_id'=>1, 'sc_category_id'=>1]); // for tell organizer what cat available to add into a slot
        \App\Models\Calendar\SlotCategory::create(['sc_slot_id'=>2, 'sc_category_id'=>1]);
        \App\Models\Calendar\SlotCategory::create(['sc_slot_id'=>3, 'sc_category_id'=>1]);
        \App\Models\Calendar\SlotCategory::create(['sc_slot_id'=>4, 'sc_category_id'=>1]);

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