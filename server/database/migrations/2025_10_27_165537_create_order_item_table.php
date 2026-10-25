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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('product');
            $table->decimal('price');
            $table->unsignedInteger('quantity');
            $table->timestamps();

            // === Foreign Keys ===
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');

            // === Indexes ===
            $table->index('order_id');
            $table->index(['product_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
