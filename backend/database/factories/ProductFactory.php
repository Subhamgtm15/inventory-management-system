<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-???')),
            'category_id' => Category::factory(),
            'price' => fake()->randomFloat(2, 1, 999),
            'quantity' => fake()->numberBetween(0, 100),
            'description' => fake()->sentence(),
        ];
    }
}
