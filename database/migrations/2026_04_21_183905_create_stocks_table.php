<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->foreignId('project_id')->constrained()->restrictOnDelete();
            $table->foreignId('sector_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_item_id')->references('id')->on('invoice_items')->restrictOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('stocks')->restrictOnDelete(); // referencia para desmembrar um item do estoque

            $table->date('expires_at')->nullable();
            $table->string('stock_location')->nullable(); // ex: almoxarifado A
            $table->decimal('stock_quantity', 14, 3)->default(0);
            $table->boolean('active')->default(true);

            $table->boolean('is_patrimony')->default(false);
            $table->string('serial')->nullable(); // numero de serie do patrimônio
    
            $table->string('stock_image_path')->nullable(); // imagem do produto no estoque, atualizada

            $table->json('meta')->nullable();
            $table->timestamp('performed_at')->useCurrent();
            $table->timestamps();

            // ⚡ performance
            $table->unique(['product_id', 'stock_location']);
            $table->index(['product_id', 'invoice_id']);
            $table->index(['product_id', 'sector_id']);
            $table->index(['product_id', 'project_id']);
            $table->index(['expires_at']);
            $table->index(['serial']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS stocks CASCADE');
    }
};
