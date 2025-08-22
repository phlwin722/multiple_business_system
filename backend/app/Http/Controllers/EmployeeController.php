<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Business;
use App\Http\Requests\EmployeeRequest;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        try {

            $query = User::where('user_id', $request->user_id);

            if ($request->has('business_id') && $request->business_id > 0) {
                $query->where('business_id', $request->business_id);
            }

            if ($request->full_name != null) {
                $query->where(function ($q) use ($request) {
                    $q->where('first_name', 'like', '%' . $request->full_name . '%')
                        ->orWhere('last_name', 'like', '%' . $request->full_name . '%');
                });
            }

            // Execute query with ordering
            $employee = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($employeee) {
                    return [
                        'id' => $employeee->id,
                        'full_name' => "{$employeee->first_name} {$employeee->last_name}", // <-- Correct
                        'email' => $employeee->email,
                        'position' => $employeee->position,
                        'image' => asset($employeee->image),
                        'status' => $employeee->status ?? 'Offline', // <-- Corrected logic
                        'business_id' => $employeee->business_id,
                        'user_id' => $employeee->user_id,
                        'business_name' => $employeee->business->business_name ?? null, // <-- Here
                    ];
                });

            return response()->json([
                'message' => 'Employee list retrieved successfully',
                'data' => $employee,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(EmployeeRequest $employeeRequest)
    {
        try {
            $employee = User::findOrFail($employeeRequest->id);
            $employee->update(
                [
                    'first_name' => $employeeRequest->first_name,
                    'last_name' => $employeeRequest->last_name,
                    'email' => $employeeRequest->email,
                    'position' => $employeeRequest->position,
                    'business_id' => $employeeRequest->business_id
                ],
            );

            if ($employeeRequest->has('password')) {
                $employee->update([
                    'password' => bcrypt($employeeRequest->password)
                ]);
            }

            if ($employeeRequest->hasFile('image')) {

                // delete the old message if it exist
                if ($employee->image) {
                    $oldImagePath = public_path($employee->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath); // Delete the file
                    }
                }

                // Process and save the uploaded file
                if ($employeeRequest->hasFile('image')) {
                    $file = $employeeRequest->file('image');
                    $filename = time() . '.' . $file->getClientOriginalExtension();

                    // define the folder path (inside public directory)
                    $folderPath = public_path('assets/product/' . $employeeRequest->id);

                    // Ensure the folder exists
                    if (!file_exists($folderPath)) {
                        mkdir($folderPath, 0755, true);  // Create folder with proper permissions
                    }

                    // move file to the folder
                    $file->move($folderPath, $filename);

                    // correct url public access
                    $filePath = "assets/product/{$employeeRequest->id}/{$filename}";

                    $employee->update(['image' => $filePath]);
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

            $deletedCount = User::whereIn('id', $ids)->delete();

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

    public function insert(EmployeeRequest $employeeRequest)
    {
        try {
            $data = $employeeRequest->validated();
            $product = User::create($data);

            // Process and save the uploaded file
            if ($employeeRequest->hasFile('image')) {
                $file = $employeeRequest->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();

                // define the folder path (inside public directory)
                $folderPath = public_path('assets/employee/' . $product->id);

                // Ensure the folder exists
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);  // Create folder with proper permissions
                }

                // move file to the folder
                $file->move($folderPath, $filename);

                // correct url public access
                $filePath = "assets/employee/{$product->id}/{$filename}";

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
            $data = User::findOrFail($request->id);

            $image = asset($data->image);

            return response()->json([
                'message' => "Business retrieved successfully",
                'data' => [
                    'id' => $data->id,
                    'first_name' => $data->first_name,
                    'last_name' => $data->last_name,
                    'email' => $data->email,
                    'position' => $data->position,
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
            $data = Business::where('user_id', $request->user_id)
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
