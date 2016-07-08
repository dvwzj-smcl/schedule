<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScheduleModuleTables extends Migration
{
    public function __construct()
    {
        // Get the prefix
        $this->prefix = "sc_";
    }
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');

            // config
            $table->string('color'); // #ffffff

            $table->timestamps();
        });

        Schema::create('sales', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('organizers', function (Blueprint $table) {  // Organize Queue (Middleman)
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('customers', function (Blueprint $table) {  // not user!
            $table->increments('id');
            $table->string('name');
            $table->string('hn');
            $table->string('phone');
            $table->string('contact');
            $table->timestamps();
        });

        Schema::create('slots', function (Blueprint $table) {
            $table->increments('id');

            // *** START
            // --- can be ---

            $table->dateTime('start');
            $table->dateTime('end');

            // --- or ---

            $table->date('day');
            $table->integer('start'); // eg. 0 = 0:00, 11 = 5:30 (30min)
            $table->integer('end'); // eg. 0 = 0:00, 11 = 5:30 (30min)

            // --- or ---

            $table->date('day');
            $table->integer('start'); // eg. 0 = 0:00, 11 = 5:30 (30min)
            $table->integer('duration'); // eg. 1 = 30min, 2 = 1 hour

            // *** END

            $table->integer('doctor_id');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('organizer_id'); // for record
            $table->foreign('organizer_id')->references('id')->on('organizers')->onUpdate('cascade')->onDelete('restrict');

            // flags
            $table->boolean('is_full');

            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {  // Organize Queue (Middleman)
            $table->increments('id');
            $table->string('name');

            // config
            $table->string('color'); // #ffffff
            
            $table->timestamps();
        });

        Schema::create('subcats', function (Blueprint $table) {  // Organize Queue (Middleman)
            $table->increments('id');
            $table->string('name');
            $table->integer('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamps();
        });

        Schema::create('category_slot', function (Blueprint $table) { // Pivot without data
            $table->integer('slot_id');
            $table->foreign('slot_id')->references('id')->on('slots')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('doctor_id');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onUpdate('cascade')->onDelete('cascade');
        });

        Schema::create('doctor_subcat', function (Blueprint $table) { // Pivot with data (duration)
            $table->integer('subcat_id');
            $table->foreign('subcat_id')->references('id')->on('subcats')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('doctor_id');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('duration'); // min
        });

        Schema::table('calendar_events', function (Blueprint $table) {
            $table->integer('slot_id')->unsigned();
            $table->foreign('slot_id')->references('id')->on('slots')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('sale_id')->unsigned();
            $table->foreign('sale_id')->references('id')->on('sales')->onUpdate('cascade')->onDelete('restrict');
            $table->integer('customer_id')->unsigned();
            $table->foreign('customer_id')->references('id')->on('customers')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // todo
    }
}
