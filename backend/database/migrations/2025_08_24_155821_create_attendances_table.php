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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('time_in')->nullable();
            $table->string("time_out")->nullable();
            $table->foreignId('user_id')
                ->constrained('users', 'id')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();

            // ✅ Add indexes for better query performance
            $table->index(['user_id', 'time_out']);           // Helps with whereNull + user_id
            $table->index(['user_id', 'time_out', 'time_in']); // Helps with orderBy + filters
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
