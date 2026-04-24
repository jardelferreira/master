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
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('trade_name')->nullable();
            $table->string('document', 20)->unique()->index(); // CNPJ/CPF
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('contact_name')->nullable();
            // Endereço (simples por enquanto)
            $table->string('city')->nullable();
            $table->string('state', 2)->nullable();
            // Status
            $table->boolean('active')->default(true);
            // Metadados (expansão futura)
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->index(['name']);

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
