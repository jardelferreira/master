<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table(
            'stock_movements',
            function (Blueprint $table) {

                $table->foreignId('employee_id')
                    ->nullable()
                    ->after('user_id')
                    ->constrained()
                    ->nullOnDelete();


                $table->foreignId('leader_employee_id')
                    ->nullable()
                    ->constrained('employees')
                    ->nullOnDelete();

                $table->index([
                    'project_id',
                    'employee_id',
                ]);

                $table->index([
                    'project_id',
                    'team_id',
                ]);

                $table->index([
                    'project_id',
                    'application_area_id',
                ]);
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(
            'stock_movements',
            function (Blueprint $table) {

                $table->dropConstrainedForeignId('employee_id');
                $table->dropConstrainedForeignId('leader_employee_id');
            }
        );
    }
};
