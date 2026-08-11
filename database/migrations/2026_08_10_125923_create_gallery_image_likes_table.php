<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_image_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_image_id')->constrained()->cascadeOnDelete();
            $table->string('visitor_token', 64);
            $table->timestamps();

            $table->unique(['gallery_image_id', 'visitor_token']);
            $table->index('visitor_token');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_image_likes');
    }
};
