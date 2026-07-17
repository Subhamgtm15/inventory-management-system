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
     * List categories with optional search and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = Category::query()
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
     * Store a new category.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show a single category.
     */
    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category->loadCount('products'));
    }

    /**
     * Update an existing category.
     */
    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    /**
     * Delete a category.
     */
    public function destroy(Category $category): Response
    {
        $category->delete();

        return response()->noContent();
    }
}
