<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Return dashboard summary statistics.
     */
    public function index(Request $request): JsonResponse
    {
        // Products at or below this quantity are considered "low stock".
        $threshold = $request->integer('low_stock_threshold', 10);

        $lowStockProducts = Product::query()
            ->with('category')
            ->where('quantity', '<=', $threshold)
            ->orderBy('quantity')
            ->limit(10)
            ->get();

        return response()->json([
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'low_stock_count' => Product::where('quantity', '<=', $threshold)->count(),
            'low_stock_threshold' => $threshold,
            'low_stock_products' => ProductResource::collection($lowStockProducts),
        ]);
    }
}
