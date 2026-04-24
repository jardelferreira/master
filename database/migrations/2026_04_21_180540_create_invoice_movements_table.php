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
        Schema::create('invoice_movements', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            // tipo baseado no seu enum
            $table->string('type')->index(); // received, inspected, approved...
            // auditoria
            $table->timestamp('performed_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            // ⚡ performance
            $table->index(['invoice_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_movements');
    }
};
