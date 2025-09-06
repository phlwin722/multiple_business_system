<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $now = Carbon::now();

        DB::table('users')->insert([
            [
                'id' => '1',
                'first_name' => 'Dexter',
                'last_name' => 'Jamero',
                'email' => 'jamerodexter@gmail.com',
                'password' => bcrypt('Dex@1111'),
                'position' => 'Admin',
                'statuss' => 'Activate',
                'status' => 'Online',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('businesses')->insert([
            [
                'id' => '1',
                'business_name' => 'Empanaduuuuh',
                'image' => 'assets/businesses/1/empanaduuh.jpg',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '2',
                'business_name' => 'Ez Works Garage',
                'image' => 'assets/businesses/2/ez-work-garage.jpg',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('users')->insert([
            [
                'id' => '2',
                'first_name' => 'Mark',
                'last_name' => 'Angeles',
                'email' => 'markangeles@gmail.com ',
                'password' => bcrypt('Dex@1111'),
                'position' => 'Teller',
                'statuss' => 'Activate',
                'image' => 'assets/employee/2/pixel-lab.jpg',
                'user_id' => 1,
                'business_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '3',
                'first_name' => 'Rito',
                'last_name' => 'Ebron',
                'email' => 'ritoebron@gmail.com',
                'password' => bcrypt('Dex@1111'),
                'position' => 'Manager',
                'statuss' => 'Activate',
                'image' => 'assets/employee/3/rito-ebron.jpg',
                'user_id' => 1,
                'business_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '4',
                'first_name' => 'Json',
                'last_name' => 'Mark',
                'email' => 'jsonmark@gmail.com',
                'password' => bcrypt('Dex@1111'),
                'position' => 'Teller',
                'statuss' => 'Activate',
                'image' => 'assets/employee/4/json-mark.jpg',
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '5',
                'first_name' => 'Pixel',
                'last_name' => 'Lab',
                'email' => 'pixellab@gmail.com',
                'password' => bcrypt('Dex@1111'),
                'position' => 'Manager',
                'statuss' => 'Activate',
                'image' => 'assets/employee/5/mark-angeles.jpg',
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '6',
                'first_name' => 'Karlo',
                'last_name' => 'Doctolero',
                'email' => 'karlodoctolero@gmail.com',
                'password' => bcrypt('Dex@1111'),
                'position' => 'Manager',
                'statuss' => 'Deactivate',
                'image' => 'assets/employee/6/karlo-doctolero.jpg',
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('products')->insert([
            [
                'id' => '1',
                'product_name' => 'Carne Nortte',
                'price' => 25.00,
                'quantity' => 40,
                'image' => 'assets/product/1/empanada-car-norte.jpg',
                'status' => 'Activate',
                'business_id' => 1,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '2',
                'product_name' => 'Spinach',
                'price' => 25.00,
                'quantity' => 20,
                'image' => 'assets/product/2/empanada-spinach.jpg',
                'status' => 'Activate',
                'business_id' => 1,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '3',
                'product_name' => 'Clutch bearing barako',
                'price' => 110.00,
                'quantity' => 20,
                'image' => 'assets/product/3/clutch-bearing-barako.jpg',
                'status' => 'Activate',
                'business_id' => 2,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '4',
                'product_name' => 'Barako 175 break show',
                'price' => 200.00,
                'quantity' => 10,
                'image' => 'assets/product/4/barako-break-shoe.png',
                'status' => 'Activate',
                'business_id' => 2,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '5',
                'product_name' => 'Ube',
                'price' => 25.00,
                'quantity' => 20,
                'image' => 'assets/product/5/empanda-ube.jpg',
                'status' => 'Activate',
                'business_id' => 1,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '6',
                'product_name' => 'Pineapple',
                'price' => 25.00,
                'quantity' => 0,
                'image' => 'assets/product/6/empanada-pineapple.jpg',
                'status' => 'Activate',
                'business_id' => 1,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '7',
                'product_name' => 'Horn',
                'price' => 25.00,
                'quantity' => 20,
                'image' => 'assets/product/7/horn.jpg',
                'status' => 'Activate',
                'business_id' => 2,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('attendances')->insert([
            [
                'id' => 1,
                'time_in' => '2025-09-06 11:40:07',
                'time_out' => '2025-09-06 11:40:18',
                'id_user_create' => 6,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 11:40:07',
                'updated_at' => '2025-09-06 11:40:18',
            ],
            [
                'id' => 2,
                'time_in' => '2025-09-06 11:42:58',
                'time_out' => '2025-09-06 11:58:48',
                'id_user_create' => 5,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 11:42:58',
                'updated_at' => '2025-09-06 11:58:48',
            ],
            [
                'id' => 3,
                'time_in' => '2025-09-06 12:40:47',
                'time_out' => '2025-09-06 12:59:57',
                'id_user_create' => 5,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 12:40:47',
                'updated_at' => '2025-09-06 12:59:57',
            ],
            [
                'id' => 4,
                'time_in' => '2025-09-06 13:01:16',
                'time_out' => '2025-09-06 13:10:09',
                'id_user_create' => 4,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 13:01:16',
                'updated_at' => '2025-09-06 13:10:09',
            ],
            [
                'id' => 5,
                'time_in' => '2025-09-05 13:01:16',
                'time_out' => '2025-09-05 13:10:09',
                'id_user_create' => 4,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 13:01:16',
                'updated_at' => '2025-09-06 13:10:09',
            ],
            [
                'id' => 6,
                'time_in' => '2025-09-04 12:40:47',
                'time_out' => '2025-09-04 12:59:57',
                'id_user_create' => 5,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 12:40:47',
                'updated_at' => '2025-09-06 12:59:57',
            ],
            [
                'id' => 7,
                'time_in' => $now,
                'time_out' => $now,
                'id_user_create' => 6,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 11:40:07',
                'updated_at' => $now,
            ],
            [
                'id' => 8,
                'time_in' => $now,
                'time_out' => $now,
                'id_user_create' => 4,
                'user_id' => 1,
                'business_id' => 2,
                'created_at' => '2025-09-06 11:40:07',
                'updated_at' => '2025-09-06 11:40:18',
            ],
        ]);

        $this->call([
            SalesSeeder::class,
            SalesBusiness1Seeder::class,
            AttendanceSeeder::class,
        ]);
    }
}
