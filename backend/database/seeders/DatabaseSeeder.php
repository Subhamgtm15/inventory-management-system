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
        User::updateOrCreate(
            ['email' => 'admin@inventory.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        // Sample catalog data (only when the tables are empty).
        if (Category::count() === 0) {
            Category::factory(5)
                ->has(Product::factory()->count(8))
                ->create();
        }
    }
}
