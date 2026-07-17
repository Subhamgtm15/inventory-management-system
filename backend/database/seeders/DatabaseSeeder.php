<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default admin login for the Inventory Management System.
        $admin = User::updateOrCreate(
            ['email' => 'admin@inventory.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        // Sample catalog data owned by the admin (only when empty).
        if ($admin->categories()->count() === 0) {
            Category::factory(5)
                ->for($admin)
                ->has(Product::factory()->count(8)->for($admin))
                ->create();
        }
    }
}
