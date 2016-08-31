<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserModuleTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function(Blueprint $table) {
            $table->increments('id');
            $table->string('name') ;
            $table->string('username') ;
            $table->string('email')->unique();
            $table->string('phone', 20);
            $table->string('phone_2', 20)->nullable();
            $table->string('password', 60);
            $table->string('status', 60)->nullable();
            $table->integer('branch_id')->unsigned();
            $table->string('lang', 2)->default('th');
            $table->rememberToken();
            $table->timestamps();
        });
        
        Schema::create('branches', function(Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50)->unique();
            $table->string('email', 100);
            $table->string('phone', 20);
            $table->string('fax', 20);
            $table->text('address');
            $table->text('desc');
            $table->timestamps() ;
        });
        Schema::create('user_type', function(Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50)->unique();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
        Schema::drop('branches');
        Schema::drop('user_type');
    }
}
