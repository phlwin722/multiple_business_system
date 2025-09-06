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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('order_quantity');
            $table->decimal('price', 10, 2);
            $table->string('payment_mode');
            $table->foreignId('product_id')
                ->constrained('products', 'id')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('business_id')
                ->constrained('businesses', 'id')
                ->onDelete('cascade')
                ->onUpdate('cascade'); 
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users', 'id')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
