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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('donor_name');
            $table->string('donor_email');
            $table->string('donor_phone')->nullable();
            $table->unsignedInteger('amount');
            $table->string('currency', 3)->default('GHS');
            $table->string('reference')->unique();
            $table->enum('method', ['card', 'momo', 'bank_transfer'])->default('card');
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->string('paystack_reference')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('programme')->nullable();
            $table->text('message')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->timestamps();

            $table->index('status');
            $table->index('donor_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
