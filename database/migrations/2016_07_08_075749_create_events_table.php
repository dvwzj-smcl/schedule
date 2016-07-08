<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->datetime('start');
            $table->datetime('end');
            $table->timestamps();
        });
        Schema::table('calendar_events', function (Blueprint $table) {
            $table->foreign('sub_category_id')->references('id')->on('calendar_sub_categories')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('user_doctor_id')->unsigned();
            $table->foreign('user_doctor_id')->references('id')->on('user_doctors')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('user_sale_id')->unsigned()->nullable();
            $table->foreign('user_sale_id')->references('id')->on('user_sales')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('user_customer_id')->unsigned()->nullable();
            $table->foreign('user_customer_id')->references('id')->on('user_customers')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('calendar_events');
    }
}
