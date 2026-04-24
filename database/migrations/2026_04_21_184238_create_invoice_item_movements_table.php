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
        Schema::create('invoice_item_movements', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('invoice_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('quantity', 12, 3);
            $table->string('type')->index(); // in, out, return, adjust
            $table->string('reason')->nullable()->index(); // in, out, return, adjust
            $table->timestamp('performed_at')->nullable();
            $table->foreignId('stock_id')->nullable()->constrained()->nullOnDelete();
            $table->text('notes')->nullable();
            $table->boolean('requires_inspection')->default(false);
            $table->boolean('is_approved')->nullable();
            $table->timestamps();
            // ⚡ performance
            $table->index(['invoice_item_id','type']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_item_movements');
    }
};
