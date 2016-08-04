<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScheduleModuleTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sc_doctors', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->string('color')->default('#ffffff');
            $table->timestamps();
        });
        Schema::create('sc_sales', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamps();
        });
        Schema::create('sc_organizers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamps();
        });
        Schema::create('sc_customers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('hn')->nullable();
            $table->string('phone');
            $table->string('contact');
            $table->timestamps();
        });
        Schema::create('sc_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
        });
        Schema::create('sc_sub_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('sc_category_id')->unsigned();
            $table->foreign('sc_category_id')->references('id')->on('sc_categories')->onUpdate('cascade')->onDelete('restrict');
        });
        Schema::create('sc_doctor_categories', function (Blueprint $table) {
            $table->string('color')->default('#ffffff');
            $table->integer('sc_doctor_id')->unsigned();
            $table->foreign('sc_doctor_id')->references('id')->on('sc_doctors')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_category_id')->unsigned();
            $table->foreign('sc_category_id')->references('id')->on('sc_categories')->onUpdate('cascade')->onDelete('restrict');
        });
        Schema::create('sc_doctor_sub_categories', function (Blueprint $table) {
            $table->integer('duration')->default(60);
            $table->integer('sc_doctor_id')->unsigned();
            $table->foreign('sc_doctor_id')->references('id')->on('sc_doctors')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_sub_category_id')->unsigned();
            $table->foreign('sc_sub_category_id')->references('id')->on('sc_sub_categories')->onUpdate('cascade')->onDelete('restrict');
        });
        Schema::create('sc_slots', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('start');
            $table->dateTime('end');
            $table->timestamps();
            $table->boolean('is_full')->default(false);
            $table->integer('sc_organizer_id')->unsigned();
            $table->foreign('sc_organizer_id')->references('id')->on('sc_organizers')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_doctor_id')->unsigned();
            $table->foreign('sc_doctor_id')->references('id')->on('sc_doctors')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_category_id')->unsigned();
            $table->foreign('sc_category_id')->references('id')->on('sc_categories')->onUpdate('cascade')->onDelete('restrict');
        });
        Schema::create('sc_events', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('sc_slot_id')->unsigned();
            $table->foreign('sc_slot_id')->references('id')->on('sc_slots')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_sub_category_id')->unsigned();
            $table->foreign('sc_sub_category_id')->references('id')->on('sc_sub_categories')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_sale_id')->unsigned()->nullable();
            $table->foreign('sc_sale_id')->references('id')->on('sc_sales')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_customer_id')->unsigned()->nullable();
            $table->foreign('sc_customer_id')->references('id')->on('sc_customers')->onUpdate('cascade')->onDelete('restrict');
        });
        Schema::create('sc_requests', function (Blueprint $table) {
            $table->boolean('approved')->default(false);
            $table->integer('sc_event_id')->unsigned();
            $table->foreign('sc_event_id')->references('id')->on('sc_events')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_sale_id')->unsigned();
            $table->foreign('sc_sale_id')->references('id')->on('sc_sales')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sc_requests');
        Schema::drop('sc_events');
        Schema::drop('sc_slots');
        Schema::drop('sc_doctor_sub_categories');
        Schema::drop('sc_doctor_categories');
        Schema::drop('sc_sub_categories');
        Schema::drop('sc_categories');
        Schema::drop('sc_customers');
        Schema::drop('sc_organizers');
        Schema::drop('sc_sales');
        Schema::drop('sc_doctors');
    }
}
