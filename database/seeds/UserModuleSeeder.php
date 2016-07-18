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
        \App\Models\User\Branch::create([
            'name' => 'สาขาสยามสแควร์',
            'email' => 'info@masterpiececlinic.com',
            'phone' => '026580531',
            'fax' => '026580503',
            'address' => '199/6,201 ถ.พระราม1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพ 10330',
            'desc' => 'สาขาแรก',
        ]);

        $role_admin = \App\Models\User\Role::create(['name'=>'admin', 'display_name'=>'User Administrator', 'description'=>'User is allowed to manage and edit other users']);
        $role_doctor = \App\Models\User\Role::create(['name'=>'doctor', 'display_name'=>'User Doctor', 'description'=>'Just a doctor role']);
        $role_organizer = \App\Models\User\Role::create(['name'=>'organizer', 'display_name'=>'User Organizer', 'description'=>'Just a organizer role']);
        $role_sale = \App\Models\User\Role::create(['name'=>'sale', 'display_name'=>'User Sale', 'description'=>'Just a sale role']);

        $user_admin = \App\Models\User\User::create(['name'=>'Admin', 'username'=>'admin', 'email'=>'admin@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_doctor_a = \App\Models\User\User::create(['name'=>'Doctor A', 'username'=>'doctora', 'email'=>'doctora@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_doctor_b = \App\Models\User\User::create(['name'=>'Doctor B', 'username'=>'doctorb', 'email'=>'doctorb@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_organizer_a = \App\Models\User\User::create(['name'=>'Organizer A', 'username'=>'organizera', 'email'=>'organizera@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_organizer_b = \App\Models\User\User::create(['name'=>'Organizer B', 'username'=>'organizerb', 'email'=>'organizerb@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_sale_a = \App\Models\User\User::create(['name'=>'Sale A', 'username'=>'salea', 'email'=>'salea@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);
        $user_sale_b = \App\Models\User\User::create(['name'=>'Sale B', 'username'=>'saleb', 'email'=>'saleb@localhost', 'password'=>bcrypt('password'), 'lang'=>'th', 'branch_id'=>1, 'phone'=>'020001111', 'phone_2'=>'020001111']);

        $user_admin->attachRole($role_admin);
        $user_doctor_a->attachRole($role_doctor);
        $user_doctor_b->attachRole($role_doctor);
        $user_organizer_a->attachRole($role_organizer);
        $user_organizer_b->attachRole($role_organizer);
        $user_sale_a->attachRole($role_sale);
        $user_sale_b->attachRole($role_sale);

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

        $perms['view-schedules'] = \App\Models\User\Permission::create(['name'=>'view-schedules', 'display_name'=>'View Schedules', 'description'=>'']);
        $perms['organize-schedules'] = \App\Models\User\Permission::create(['name'=>'organize-schedules', 'display_name'=>'Edit Schedules', 'description'=>'']);
        $perms['edit-schedules'] = \App\Models\User\Permission::create(['name'=>'edit-schedules', 'display_name'=>'Edit Schedules', 'description'=>'']);
        $perms['request-schedules'] = \App\Models\User\Permission::create(['name'=>'request-schedules', 'display_name'=>'Request Schedules', 'description'=>'']);

        $role_admin->attachPermission($perms['view-users']);
        $role_admin->attachPermission($perms['edit-users']);
        $role_admin->attachPermission($perms['view-roles']);
        $role_admin->attachPermission($perms['edit-roles']);

        $role_doctor->attachPermission($perms['view-schedules']);
        $role_organizer->attachPermission($perms['organize-schedules']);
        $role_organizer->attachPermission($perms['edit-schedules']);
        $role_organizer->attachPermission($perms['request-schedules']);
        $role_sale->attachPermission($perms['request-schedules']);
    }
}
