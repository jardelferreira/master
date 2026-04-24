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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('slug')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sector_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            // arquivos
            $table->string('xml_path')->nullable();
            $table->string('pdf_path')->nullable();

            // Identificação fiscal
            $table->string('number'); // número da NF
            $table->string('series');
            $table->string('access_key')->nullable()->unique(); // chave NF-e
            $table->string('type')->index(); // Enum de tipos
            // Status
            $table->string('status')->index(); // draft, issued, cancelled, etc.
            // Valores
            $table->decimal('total', 12, 2);
            $table->decimal('taxes', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->json('meta')->nullable(); //Meta dados futuros
            $table->timestamps();

            $table->unique(['number', 'series']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
