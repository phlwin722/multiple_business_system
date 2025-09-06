<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Business;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;

class DashboardController extends Controller
{
    public function sales($id)
    {
        try {
            $sale = Sale::where("user_id", $id)->get();

            $totalSales = $sale->reduce(function ($carry, $sale) {
                return $carry + ($sale->order_quantity * $sale->price);
            });

            $formattedTotal = number_format($totalSales, 2);

            return response()->json([
                'data' => $formattedTotal
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ]);
        }
    }

    public function employee($id)
    {
        try {
            $user = User::where('user_id', $id)
                ->where('position', '!=', 'Admin')
                ->where("statuss", '!=', "Deactivate")
                ->count();

            return response()->json([
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ]);
        }
    }

    public function products($id)
    {
        try {
            $product = Product::where('user_id', $id)
                ->where("status", '!=', "Deactivate")
                ->count();

            return response()->json([
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ]);
        }
    }

    public function business($id)
    {
        try {
            $business = Business::where('user_id', $id)
                ->count();

            return response()->json([
                'data' => $business
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ]);
        }
    }

    public function ProductList($id)
    {
        try {
            $product = Sale::select(
                'sales.id',
                'sales.product_id',
                'products.product_name',
                'sales.order_quantity',
                'products.image',
                'sales.business_id',
                'businesses.business_name',
            )
                ->join('products', 'sales.product_id', '=', 'products.id')
                ->join('businesses', 'sales.business_id', '=', 'businesses.id')
                ->where('sales.user_id', $id)
                ->orderByRaw('CAST(sales.order_quantity AS UNSIGNED) DESC')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'product_id' => $product->product_id,
                        'product_name' => $product->product_name,
                        'quantity_sold' => $product->order_quantity . " sold",
                        'image' => asset($product->image),
                        'business_id' => $product->business_id,
                        'business_name' => $product->business_name,
                    ];
                });

            return response()->json([
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function OutOfStock($id)
    {
        try {
            $query = Product::where('user_id', $id)
                ->where('quantity', '=', '0');
            $products = $query->with('business')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'product_name' => $product->product_name,
                        'business_id' => $product->business_id,
                        'image' => asset($product->image),
                        'business_name' => $product->business->business_name ?? null,
                    ];
                });
            return response()->json([
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
