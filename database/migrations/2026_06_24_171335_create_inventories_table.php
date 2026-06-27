<?php

use App\Enum\InventoryStatusEnum;
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
        Schema::create('inventories', function (Blueprint $table) {

            $table->id();

            $table->string('name');

            $table->foreignId('project_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('status')
                ->default(
                    InventoryStatusEnum::OPEN->value
                );

            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('due_date')
                ->nullable();

            $table->timestamp('finished_at')
                ->nullable();
            $table->timestamp('approved_at')
                ->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('notes')
                ->nullable();

            $table->boolean('blind_count')
                ->default(false);

            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
