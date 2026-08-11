<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_image_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_image_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('body');
            $table->timestamps();

            $table->index(['gallery_image_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_image_comments');
    }
};
