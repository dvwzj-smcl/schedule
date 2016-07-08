<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubCategoryRegistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_slots', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('duration');
            $table->string('color')->nullable();
            $table->timestamps();
        });
        Schema::table('calendar_slots', function (Blueprint $table) {
            $table->integer('calendar_sub_category_id')->unsigned();
            $table->foreign('calendar_sub_category_id')->references('id')->on('calendar_sub_categories')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('user_doctor_id')->unsigned();
            $table->foreign('user_doctor_id')->references('id')->on('user_doctors')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('user_middleman_id')->unsigned();
            $table->foreign('user_middleman_id')->references('id')->on('user_middlemen')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('calendar_slots');
    }
}
