<?php

namespace App\Http\Controllers;

use App\Http\Requests\BussinessRequest;
use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Support\Facades\DB;

class BussinessController extends Controller
{
    public function index (Request $request) {
        try {
            $data = Business::where('user_id', $request->user_id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($data) {
                return [
                    'id' => $data->id,
                    'business_name' => $data->business_name,
                    'image' => asset($data->image),
                ];
            });

            return response()->json([
                'message' => 'Business list retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update (BussinessRequest $bussinessRequest) {
        try {
            $business = Business::findOrFail($bussinessRequest->id);
            $business->update(['business_name' => $bussinessRequest->business_name]);

           if ($bussinessRequest->hasFile('image')) {

                // delete the old message if it exist
                if ($business->image) {
                    $oldImagePath = public_path($business->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath); // Delete the file
                    }
                }

                // Process and save the uploaded file
                if ($bussinessRequest->hasFile('image')) {
                    $file = $bussinessRequest->file('image');
                    $filename = time() . '.' . $file->getClientOriginalExtension();

                    // define the folder path (inside public directory)
                    $folderPath = public_path('assets/businesses/' . $bussinessRequest->id);

                    // Ensure the folder exists
                    if (!file_exists($folderPath)) {
                        mkdir($folderPath, 0755, true);  // Create folder with proper permissions
                    }

                    // move file to the folder
                    $file->move($folderPath, $filename);

                    // correct url public access
                    $filePath = "assets/businesses/{$bussinessRequest->id}/{$filename}";

                    $business->update(['image' => $filePath]);
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

    public function delete (Request $request) {
        try {
           $ids = $request->input('ids');

           if (empty($ids) || !is_array($ids)) {
            return response()->json([
                'error' => 'Invalid request'
            ],400);
           }

           $deletedCount = Business::whereIn('id', $ids)->delete();

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

    public function insert (BussinessRequest $bussinessRequest) {
        try {
            $data = $bussinessRequest->validated();
            $business = Business::create($data);

            // Process and save the uploaded file
            if ($bussinessRequest->hasFile('image')) {
                $file = $bussinessRequest->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();

                // define the folder path (inside public directory)
                $folderPath = public_path('assets/businesses/' . $business->id);

                // Ensure the folder exists
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);  // Create folder with proper permissions
                }

                // move file to the folder
                $file->move($folderPath, $filename);

                // correct url public access
                $filePath = "assets/businesses/{$business->id}/{$filename}";

                /// **FIXED:** Update database using Query Builder (no `save()` method)
                $business->update(['image' => $filePath]);
            }

            return response()->json([
                'message' => "Business created successfully",
                'data' => $business
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function find (Request $request) {
        try {
            $data = Business::findOrFail($request->id);

            $image = asset($data->image);

            return response()->json([
                'message' => "Business retrieved successfully",
                'data' => [
                    'id' => $data->id,
                    'business_name' => $data->business_name,
                    'image' => $image
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
