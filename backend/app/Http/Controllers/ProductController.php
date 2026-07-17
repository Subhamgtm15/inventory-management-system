<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /**
     * List products with search, category filter, and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with('category')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'ilike', "%{$search}%")
                        ->orWhere('sku', 'ilike', "%{$search}%");
                });
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->integer('category_id'));
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return ProductResource::collection($products);
    }

    /**
     * Store a new product.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return (new ProductResource($product->load('category')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show a single product.
     */
    public function show(Product $product): ProductResource
    {
        return new ProductResource($product->load('category'));
    }

    /**
     * Update an existing product.
     */
    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $product->update($request->validated());

        return new ProductResource($product->load('category'));
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }
}
