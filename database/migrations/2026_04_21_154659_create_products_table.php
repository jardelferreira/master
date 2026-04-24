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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            // Unidade (muito importante)
            $table->string('unit')->default('un'); // un, kg, m, etc
            $table->string('sku')->nullable()->index();
            $table->boolean('active')->default(true);
            // flexibilidade futura
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['name']);
            $table->index(['category_id','active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
