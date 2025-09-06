<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesBusiness1Seeder extends Seeder
{
    public function run(): void
    {
        $startDate = Carbon::create(2025, 8, 1);
        $endDate = Carbon::create(2025, 9, 9);

        $productIds = [1, 2, 5, 6];
        $paymentModes = ['Cash', 'E-Wallet'];
        $businessId = 1;
        $userId = 1;

        $data = [];

        while ($startDate <= $endDate) {
            for ($i = 0; $i < 10; $i++) {
                $data[] = [
                    'order_quantity' => rand(1, 200),
                    'price' => 25.00,
                    'payment_mode' => $paymentModes[array_rand($paymentModes)],
                    'product_id' => $productIds[array_rand($productIds)],
                    'business_id' => $businessId,
                    'user_id' => $userId,
                    'created_at' => $startDate->copy()->addSeconds(rand(0, 86400)),
                    'updated_at' => $startDate->copy()->addSeconds(rand(0, 86400)),
                ];
            }
            $startDate->addDay();
        }

        // Insert into DB in chunks (optional for large inserts)
        foreach (array_chunk($data, 100) as $chunk) {
            DB::table('sales')->insert($chunk);
        }

        echo "Seeded " . count($data) . " sale records.\n";
    }
}
