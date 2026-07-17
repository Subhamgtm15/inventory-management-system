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
     * List the authenticated user's products with search, category filter, and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = $request->user()->products()
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
     * Store a new product owned by the authenticated user.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $request->user()->products()->create($request->validated());

        return (new ProductResource($product->load('category')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show a single product (must belong to the authenticated user).
     */
    public function show(Request $request, Product $product): ProductResource
    {
        $this->authorizeOwner($request, $product);

        return new ProductResource($product->load('category'));
    }

    /**
     * Update an existing product (must belong to the authenticated user).
     */
    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $this->authorizeOwner($request, $product);

        $product->update($request->validated());

        return new ProductResource($product->load('category'));
    }

    /**
     * Delete a product (must belong to the authenticated user).
     */
    public function destroy(Request $request, Product $product): Response
    {
        $this->authorizeOwner($request, $product);

        $product->delete();

        return response()->noContent();
    }

    /**
     * Abort with 404 if the product does not belong to the current user.
     */
    private function authorizeOwner(Request $request, Product $product): void
    {
        abort_if($product->user_id !== $request->user()->id, Response::HTTP_NOT_FOUND);
    }
}
