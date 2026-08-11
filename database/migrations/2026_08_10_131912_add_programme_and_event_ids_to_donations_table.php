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
        Schema::table('donations', function (Blueprint $table) {
            $table->foreignId('programme_id')
                ->nullable()
                ->after('is_recurring')
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('event_id')
                ->nullable()
                ->after('programme_id')
                ->constrained()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('programme_id');
            $table->dropConstrainedForeignId('event_id');
        });
    }
};
