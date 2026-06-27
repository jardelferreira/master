<?php

use App\Enum\InventoryItemStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {

            $table->id();

            $table->foreignId('inventory_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('stock_id')
                ->constrained()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Snapshot
            |--------------------------------------------------------------------------
            */

            $table->decimal(
                'system_quantity',
                15,
                3
            );

            /*
            |--------------------------------------------------------------------------
            | Contagem
            |--------------------------------------------------------------------------
            */

            $table->decimal(
                'counted_quantity',
                15,
                3
            )->nullable();

            $table->decimal(
                'difference',
                15,
                3
            )->nullable();

            $table->foreignId('counted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('counted_at')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->string('status')
                ->default(
                    InventoryItemStatusEnum::PENDING->value
                );

            $table->timestamps();

            $table->index([
                'inventory_id',
                'status',
            ]);

            $table->index('stock_id');

            $table->unique([
                'inventory_id',
                'stock_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};