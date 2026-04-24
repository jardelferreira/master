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
        Schema::create('stock_minimals', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sector_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('min_quantity', 14, 3);
            $table->json('meta')->nullable();
            $table->timestamps();
            
            $table->unique(['product_id', 'project_id', 'sector_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_minimals');
    }
};
