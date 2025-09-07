<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SalesSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['product_id' => 7, 'price' => 25.00],
            ['product_id' => 3, 'price' => 110.00],
            ['product_id' => 4, 'price' => 200.00],
        ];

        $paymentModes = ['Cash', 'E-Wallet'];

        $startDate = Carbon::create(2025, 8, 1);
        $endDate = Carbon::create(2025, 9, 9);

        $userId = 1;
        $businessId = 2;

        $id = 1;

        while ($startDate->lte($endDate)) {
            for ($i = 0; $i < 10; $i++) {
                $product = $products[array_rand($products)];
                $quantity = rand(1, 200);
                $paymentMode = $paymentModes[array_rand($paymentModes)];

                $createdAt = $startDate->copy()->setTime(rand(8, 17), rand(0, 59), rand(0, 59));

                Sale::create([
                    'id' => $id++,
                    'order_quantity' => $quantity,
                    'price' => $product['price'],
                    'payment_mode' => $paymentMode,
                    'product_id' => $product['product_id'],
                    'business_id' => $businessId,
                    'user_id' => $userId,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }

            $startDate->addDay();
        }
    }
}
