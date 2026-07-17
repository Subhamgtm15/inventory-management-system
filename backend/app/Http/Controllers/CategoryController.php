<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    /**
     * List the authenticated user's categories with optional search and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = $request->user()->categories()
            ->withCount('products')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where('name', 'ilike', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15));

        return CategoryResource::collection($categories);
    }

    /**
     * Store a new category owned by the authenticated user.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $request->user()->categories()->create($request->validated());

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show a single category (must belong to the authenticated user).
     */
    public function show(Request $request, Category $category): CategoryResource
    {
        $this->authorizeOwner($request, $category);

        return new CategoryResource($category->loadCount('products'));
    }

    /**
     * Update an existing category (must belong to the authenticated user).
     */
    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $this->authorizeOwner($request, $category);

        $category->update($request->validated());

        return new CategoryResource($category);
    }

    /**
     * Delete a category (must belong to the authenticated user).
     */
    public function destroy(Request $request, Category $category): Response
    {
        $this->authorizeOwner($request, $category);

        $category->delete();

        return response()->noContent();
    }

    /**
     * Abort with 404 if the category does not belong to the current user.
     * (404 rather than 403 avoids leaking the existence of other users' data.)
     */
    private function authorizeOwner(Request $request, Category $category): void
    {
        abort_if($category->user_id !== $request->user()->id, Response::HTTP_NOT_FOUND);
    }
}
