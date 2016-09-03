<?php

use Illuminate\Database\Seeder;

class UserModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User\Branch::create(['name' => 'สาขาสยามสแควร์','email' => 'info@masterpiececlinic.com','phone' => '026580531', 'fax' => '026580503','address' => '199/6,201 ถ.พระราม1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพ 10330','desc' => 'สาขาแรก']);
        \App\Models\User\Branch::create(['name' => 'สาขาหาดใหญ่','email' => 'info@masterpiececlinic.com','phone' => '026580531', 'fax' => '026580503','address' => '199/6,201 ถ.พระราม1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพ 10330','desc' => 'สาขาสอง']);

        $role_admin = \App\Models\User\Role::create(['name'=>'admin', 'display_name'=>'Administrator', 'description'=>'User is allowed to manage and edit other users']);
        $role_doctor = \App\Models\User\Role::create(['name'=>'doctor', 'display_name'=>'Doctor', 'description'=>'Just a doctor role']);
        $role_organizer = \App\Models\User\Role::create(['name'=>'organizer', 'display_name'=>'Organizer', 'description'=>'Just a organizer role']);
        $role_sale = \App\Models\User\Role::create(['name'=>'sale', 'display_name'=>'Sale', 'description'=>'Just a sale role']);

        $doctor_count = 3;
        $sale_count = 2;
        $organizer_count = 2;

        // Generate Users

        $user_admin = \App\Models\User\User::create(['name'=>'Admin', 'username'=>'admin', 'email'=>'admin@localhost.com', 'password'=>bcrypt('asdfasdf'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_admin->attachRole($role_admin);

        for($branch_id = 1; $branch_id <= \App\Models\User\Branch::count(); $branch_id++) {
            for ($i = 1; $i <= $doctor_count; $i++) {
                $id = ($doctor_count*($branch_id-1))+$i;
                $user = \App\Models\User\User::create(['name' => "Doctor {$id}", 'username' => "doctor{$id}", 'email' => "doctor{$id}@localhost.com", 'password' => bcrypt('asdfasdf'), 'lang' => 'th', 'branch_id' => $branch_id, 'phone' => '020001111', 'phone_2' => '020001111']);
                $user->attachRole($role_doctor);
            }
            for ($i = 1; $i <= $sale_count; $i++) {
                $id = ($sale_count*($branch_id-1))+$i;
                $user = \App\Models\User\User::create(['name' => "Sale {$id}", 'username' => "sale{$id}", 'email' => "sale{$id}@localhost.com", 'password' => bcrypt('asdfasdf'), 'lang' => 'th', 'branch_id' => $branch_id, 'phone' => '020001111', 'phone_2' => '020001111']);
                $user->attachRole($role_sale);
            }
            for ($i = 1; $i <= $organizer_count; $i++) {
                $id = ($organizer_count*($branch_id-1))+$i;
                $user = \App\Models\User\User::create(['name' => "Organizer {$id}", 'username' => "organizer{$id}", 'email' => "organizer{$id}@localhost.com", 'password' => bcrypt('asdfasdf'), 'lang' => 'th', 'branch_id' => $branch_id, 'phone' => '020001111', 'phone_2' => '020001111']);
                $user->attachRole($role_organizer);
            }
        }


        /**
         * Permissions
         */

        $perms = [];

        $perms['view-users'] = \App\Models\User\Permission::create(['name'=>'view-users', 'display_name'=>'View Users', 'description'=>'']);
        $perms['edit-users'] = \App\Models\User\Permission::create(['name'=>'edit-users', 'display_name'=>'Edit Users', 'description'=>'']);

        $perms['view-roles'] = \App\Models\User\Permission::create(['name'=>'view-roles', 'display_name'=>'View Roles', 'description'=>'']);
        $perms['edit-roles'] = \App\Models\User\Permission::create(['name'=>'edit-roles', 'display_name'=>'Edit Roles', 'description'=>'']);

        $perms['view-branches'] = \App\Models\User\Permission::create(['name'=>'view-branches', 'display_name'=>'View Branches', 'description'=>'']);
        $perms['edit-branches'] = \App\Models\User\Permission::create(['name'=>'edit-branches', 'display_name'=>'Edit Branches', 'description'=>'']);

        $perms['view-customers'] = \App\Models\User\Permission::create(['name'=>'view-customers', 'display_name'=>'View Customers', 'description'=>'']);
        $perms['edit-customers'] = \App\Models\User\Permission::create(['name'=>'edit-customers', 'display_name'=>'Edit Customers', 'description'=>'']);

        // slot page
        $perms['view-slot'] = \App\Models\User\Permission::create(['name'=>'view-slot', 'display_name'=>'View Slot', 'description'=>'']);
        $perms['edit-slot'] = \App\Models\User\Permission::create(['name'=>'edit-slot', 'display_name'=>'Edit Slot', 'description'=>'']);

        // summary
        $perms['view-schedules'] = \App\Models\User\Permission::create(['name'=>'view-schedules', 'display_name'=>'View Schedules', 'description'=>'']);
        // organizer' schedule
        $perms['organize-schedules'] = \App\Models\User\Permission::create(['name'=>'organize-schedules', 'display_name'=>'Edit Schedules', 'description'=>'']);
        // sale' schedule
        $perms['request-schedules'] = \App\Models\User\Permission::create(['name'=>'request-schedules', 'display_name'=>'Request Schedules', 'description'=>'']);
        // settings
        $perms['schedule-settings'] = \App\Models\User\Permission::create(['name'=>'schedule-settings', 'display_name'=>'Schedules Settings', 'description'=>'']);

        $role_admin->attachPermission($perms['view-users']);
        $role_admin->attachPermission($perms['edit-users']);
        $role_admin->attachPermission($perms['view-roles']);
        $role_admin->attachPermission($perms['edit-roles']);
        $role_admin->attachPermission($perms['view-branches']);
        $role_admin->attachPermission($perms['edit-branches']);

        $role_doctor->attachPermission($perms['view-schedules']);
        $role_doctor->attachPermission($perms['view-customers']);
        $role_doctor->attachPermission($perms['edit-customers']);

        $role_organizer->attachPermission($perms['organize-schedules']);
        $role_organizer->attachPermission($perms['view-schedules']);
        $role_organizer->attachPermission($perms['schedule-settings']);
        $role_organizer->attachPermission($perms['view-slot']);
        $role_organizer->attachPermission($perms['edit-slot']);
        $role_organizer->attachPermission($perms['view-customers']);
        $role_organizer->attachPermission($perms['edit-customers']);

        $role_sale->attachPermission($perms['view-schedules']);
        $role_sale->attachPermission($perms['request-schedules']);
        $role_sale->attachPermission($perms['view-customers']);
        $role_sale->attachPermission($perms['edit-customers']);
    }
}
