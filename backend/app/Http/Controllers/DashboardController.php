<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Return dashboard summary statistics for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Products at or below this quantity are considered "low stock".
        $threshold = $request->integer('low_stock_threshold', 10);

        $lowStockProducts = $user->products()
            ->with('category')
            ->where('quantity', '<=', $threshold)
            ->orderBy('quantity')
            ->limit(10)
            ->get();

        return response()->json([
            'total_products' => $user->products()->count(),
            'total_categories' => $user->categories()->count(),
            'low_stock_count' => $user->products()->where('quantity', '<=', $threshold)->count(),
            'low_stock_threshold' => $threshold,
            'low_stock_products' => ProductResource::collection($lowStockProducts),
        ]);
    }
}
