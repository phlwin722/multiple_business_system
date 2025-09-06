<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $startDate = Carbon::create(2025, 8, 1, 8, 0, 0);   // Aug 1, 2025
        $endDate = Carbon::create(2025, 9, 9, 18, 0, 0);    // Sep 9, 2025

        $userCreateId = 1; // Admin or creator ID
        $userIds = [2, 3, 4, 5, 6];

        $records = [];

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            for ($i = 0; $i < 10; $i++) {
                $userId = $userIds[$i % count($userIds)];

                // 👇 Assign correct business_id based on user_id
                $businessId = in_array($userId, [2, 3]) ? 1 : 2;

                $timeIn = $date->copy()->addMinutes(rand(0, 60));
                $timeOut = $timeIn->copy()->addMinutes(rand(60, 480));

                $records[] = [
                    'time_in' => $timeIn->toDateTimeString(),
                    'time_out' => $timeOut->toDateTimeString(),
                    'id_user_create' => $userId, // 👈 employee
                    'user_id' => $userCreateId,// 👈 admin
                    'business_id' => $businessId,
                    'created_at' => $timeIn->toDateTimeString(),
                    'updated_at' => $timeOut->toDateTimeString(),
                ];
            }
        }

        DB::table('attendances')->insert($records);

        echo "✅ Seeded " . count($records) . " attendance records.\n";
    }
}
