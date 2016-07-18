<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetUpdater extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public $targets = [];

	public function up()
	{
		foreach($this->targets as $tableName) {
			Schema::table($tableName, function ($table) {
				// updater
				$table->integer('created_by')->unsigned();
				$table->integer('updated_by')->unsigned();
				$table->integer('deleted_by')->unsigned();
				$table->softDeletes();
			});
		}
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		foreach($this->targets as $tableName) {
			Schema::table($tableName, function ($table) {
				$table->dropColumn('created_by', 'updated_by', 'deleted_by', 'deleted_at');
			});
		}
	}

}
