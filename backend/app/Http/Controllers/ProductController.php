<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Bussines;
use App\Http\Requests\ProductRequest;


class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {

            $query = Product::where('user_id', $request->user_id);

            if ($request->has('business_id') && $request->business_id > 0) {
                $query->where('business_id', $request->business_id);
            }

            if ($request->product_name != null) {
                $query->where('product_name', 'like', '%'. $request->product_name . '%');
            }

            // Execute query with ordering
            $products = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'product_name' => $product->product_name,
                        'price' => $product->price,
                        'quantity' => $product->quantity,
                        'image' => asset($product->image),
                        'business_id' => $product->business_id,
                        'user_id' => $product->user_id,
                        'business_name' => $product->business->business_name ?? null, // <-- Here
                    ];
                });

            return response()->json([
                'message' => 'Product list retrieved successfully',
                'data' => $products,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(ProductRequest $productRequest)
    {
        try {
            $product = Product::findOrFail($productRequest->id);
            $product->update(
                [
                    'product_name' => $productRequest->product_name,
                    'price' => $productRequest->price,
                    'quantity' => $productRequest->quantity,
                    'business_id' => $productRequest->business_id
                ],
            );

            if ($productRequest->hasFile('image')) {

                // delete the old message if it exist
                if ($product->image) {
                    $oldImagePath = public_path($product->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath); // Delete the file
                    }
                }

                // Process and save the uploaded file
                if ($productRequest->hasFile('image')) {
                    $file = $productRequest->file('image');
                    $filename = time() . '.' . $file->getClientOriginalExtension();

                    // define the folder path (inside public directory)
                    $folderPath = public_path('assets/product/' . $productRequest->id);

                    // Ensure the folder exists
                    if (!file_exists($folderPath)) {
                        mkdir($folderPath, 0755, true);  // Create folder with proper permissions
                    }

                    // move file to the folder
                    $file->move($folderPath, $filename);

                    // correct url public access
                    $filePath = "assets/product/{$productRequest->id}/{$filename}";

                    $product->update(['image' => $filePath]);
                }
            }

            return response()->json([
                'message' => 'Updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function delete(Request $request)
    {
        try {
            $ids = $request->input('ids');

            if (empty($ids) || !is_array($ids)) {
                return response()->json([
                    'error' => 'Invalid request'
                ], 400);
            }

            $deletedCount = Product::whereIn('id', $ids)->delete();

            if ($deletedCount > 0) {
                return response()->json([
                    'message' => 'Deleted successfully',
                    'deleted' => $deletedCount
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function insert(ProductRequest $productRequest)
    {
        try {
            $data = $productRequest->validated();
            $product = Product::create($data);

            // Process and save the uploaded file
            if ($productRequest->hasFile('image')) {
                $file = $productRequest->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();

                // define the folder path (inside public directory)
                $folderPath = public_path('assets/product/' . $product->id);

                // Ensure the folder exists
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);  // Create folder with proper permissions
                }

                // move file to the folder
                $file->move($folderPath, $filename);

                // correct url public access
                $filePath = "assets/product/{$product->id}/{$filename}";

                /// **FIXED:** Update database using Query Builder (no `save()` method)
                $product->update(['image' => $filePath]);
            }

            return response()->json([
                'message' => "Business created successfully",
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function find(Request $request)
    {
        try {
            $data = Product::findOrFail($request->id);

            $image = asset($data->image);

            return response()->json([
                'message' => "Business retrieved successfully",
                'data' => [
                    'id' => $data->id,
                    'product_name' => $data->product_name,
                    'price' => $data->price,
                    'quantity' => $data->quantity,
                    'image' => $image,
                    'business_id' => $data->business_id,
                    'user_id' => $data->user_id
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function fetchBusinesses(Request $request)
    {
        try {
            $data = Bussines::where('user_id', $request->user_id)
                ->orderBy('created_at', 'asc')
                ->get();
            return response()->json([
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
