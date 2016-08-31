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
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('color')->default('#ffffff');
            $table->text('data');
            $table->timestamps();
        });
        Schema::create('sc_customers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('hn')->nullable();
            $table->string('phone');
            $table->string('contact');
            $table->timestamps();

            $table->index('hn');
            $table->index('first_name');
            $table->index('last_name');
        });
        Schema::create('sc_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('color')->default('#B1B1B1');
        });
        Schema::create('sc_sub_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('duration');
            $table->integer('sc_category_id')->unsigned();
            $table->foreign('sc_category_id')->references('id')->on('sc_categories')->onUpdate('cascade')->onDelete('restrict');
        });
        Schema::create('sc_slots', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('start');
            $table->dateTime('end');
            $table->boolean('locked')->default(false);
            $table->integer('created_by')->unsigned();
            $table->foreign('created_by')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_doctor_id')->unsigned();
            $table->foreign('sc_doctor_id')->references('id')->on('sc_doctors')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_category_id')->unsigned();
            $table->foreign('sc_category_id')->references('id')->on('sc_categories')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamps();
            $table->index('start');
        });
        Schema::create('sc_events', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('start');
            $table->dateTime('end');
            $table->integer('sc_slot_id')->unsigned();
            $table->foreign('sc_slot_id')->references('id')->on('sc_slots')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_sub_category_id')->unsigned();
            $table->foreign('sc_sub_category_id')->references('id')->on('sc_sub_categories')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sale_id')->unsigned()->nullable();
            $table->foreign('sale_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sc_customer_id')->unsigned()->nullable();
            $table->foreign('sc_customer_id')->references('id')->on('sc_customers')->onUpdate('cascade')->onDelete('restrict');
            $table->string('reason');
            /*
            * 0. none (no confirm)
            * 1. phoned
            * 2. messaged
            * 3. done
             * none 0
             * phoned -> phoned done 10 11
             * messaged -> messaged done 20 21
             * no reply 3
            */
            $table->dateTime('called_at')->nullable();
            $table->dateTime('messaged_at')->nullable();
            $table->dateTime('confirmed_at')->nullable();
            /*
             * approved
             * pending
             * rejected
             * cancel
             */
            $table->string('status');
            $table->timestamps();

            $table->index('start');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sc_events');
        Schema::drop('sc_slots');
        Schema::drop('sc_sub_categories');
        Schema::drop('sc_categories');
        Schema::drop('sc_customers');
        Schema::drop('sc_doctors');
    }
}
