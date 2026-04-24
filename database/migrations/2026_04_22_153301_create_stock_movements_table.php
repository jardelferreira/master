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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('stock_id')->constrained()->restrictOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sector_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('invoice_item_id')->nullable()->constrained()->nullOnDelete();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('destination_user_id')->nullable()->references('id')->on('users')->nullOnDelete();

            $table->decimal('quantity', 14, 3);
            $table->string('type')->index();
            $table->string('direction'); // in | out

            $table->foreignId('source_stock_id')->nullable()->constrained('stocks')->nullOnDelete();
            $table->foreignId('destination_stock_id')->nullable()->constrained('stocks')->nullOnDelete();

            $table->decimal('balance_after', 14, 3);
            // auditoria forte
            $table->timestamp('performed_at')->useCurrent();
            $table->text('notes')->nullable();

            $table->json('meta')->nullable();

            $table->timestamps();

            // ⚡ índices
            $table->index(['stock_id', 'type']);
            $table->index(['product_id', 'performed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
