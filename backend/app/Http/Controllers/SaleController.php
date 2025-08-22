<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;
use Carbon\Carbon;  

class SaleController extends Controller
{
    public function insert (Request $request) {
        try {
            $sales = [];

            foreach($request->order as $item) {

                $product = Product::findOrFail($item['id']);
                
                // check if there's enough stock
                if ($product->quantity < $item['orderQuantity']) {
                    return response()->json([
                        'message' => 'Not enough stock for product it'
                    ],400);
                }

                // reduce the stock 
                $product->quantity -= $item['orderQuantity'];
                $product->save();

                $sales[] = Sale::create([
                    'order_quantity' => $item['orderQuantity'],
                    'price' => $item['price'],
                    'product_id' => $item['id'],
                    'business_id' => $item['business_id'],
                    'user_id' => $request->user_id
                ]);
            }

            return response()->json([
                'message' => 'Created successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function indexTeller (Request $request) {
        try {   
            $user = Sale::where('user_id',$request->user_id)
                ->whereDate('created_at', Carbon::now()->toDateString())
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($sale) {
                    return [
                        'id' => $sale->id,
                        'order_quantity' => $sale->order_quantity,
                        'price' => $sale->price,
                        'product_id' => $sale->product_id,
                        'product_name' => $sale->product->product_name,
                        'image' => asset($sale->product->image),
                        'created_at' => $sale->created_at,
                    ];
                });

            return response()->json([
                'sale' => $user,
                'date' =>  Carbon::now()->toDateString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
