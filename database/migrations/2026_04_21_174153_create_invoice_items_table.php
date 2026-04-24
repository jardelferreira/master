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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->uuid();

            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('provider_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('product_name'); // nome no momento da compra
            $table->string('provider_name')->nullable();
            $table->string('description');
            $table->string('ca_number')->nullable();

            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total', 12, 2);

            $table->string('unit')->index(); //Kg, L, m³, Ton

            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);

            $table->string('delivery_status')->default('pending')->index();

            $table->json('meta')->nullable();

            $table->string('img_path')->nullable();

            $table->timestamps();

            $table->index(['invoice_id']);
            $table->index(['product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
     DB::statement('DROP TABLE IF EXISTS invoice_items CASCADE');
    }
};
