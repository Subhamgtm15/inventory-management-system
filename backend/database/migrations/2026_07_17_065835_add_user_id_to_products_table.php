<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add the owner column as nullable so existing rows remain valid.
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });

        // 2. Backfill existing products to the first user (the seeded admin).
        $firstUserId = User::query()->orderBy('id')->value('id');
        if ($firstUserId !== null) {
            DB::table('products')->whereNull('user_id')->update(['user_id' => $firstUserId]);
        }

        // 3. Enforce NOT NULL now that every row has an owner.
        DB::statement('ALTER TABLE products ALTER COLUMN user_id SET NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
