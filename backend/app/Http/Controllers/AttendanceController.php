<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $attendance = Attendance::where('user_id', $request->user_id)->with(['business', 'creator'])
                ->whereNotNull('time_in')
                ->whereNotNull('time_out');

            // ✅ Filter by business if provided
            if ($request->has('business_id') && $request->business_id > 0) {
                $attendance->where('business_id', $request->business_id);
            }

            // ✅ Handle date filters
            if ($request->calendar === 'day') {
                $attendance->whereDate('time_in', now());
            } elseif ($request->calendar === 'weekly') {
                $attendance->whereBetween('time_in', [
                    now()->startOfWeek(),
                    now()->endOfWeek()
                ]);
            } elseif ($request->calendar === 'monthly') {
                $attendance->whereMonth('time_in', now()->month)
                    ->whereYear('time_in', now()->year);
            } elseif ($request->calendar === 'yearly') {
                $attendance->whereYear('time_in', now()->year);
            } elseif ($request->calendar === 'custom' && $request->filled(['date_from', 'date_to'])) {
                $attendance->whereBetween('time_in', [
                    Carbon::parse($request->date_from)->startOfDay(),
                    Carbon::parse($request->date_to)->endOfDay()
                ]);
            }

            // ✅ Group by user for total rendered minutes
            $employee = $attendance->get()->groupBy('id_user_create')->map(function ($records, $userId) {
                $totalMinutes = $records->sum(function ($record) {
                    $in = Carbon::parse($record->time_in);
                    $out = Carbon::parse($record->time_out);
                    return $in->diffInMinutes($out);
                });

                // Convert minutes → hours & minutes
                $hours = intdiv($totalMinutes, 60);
                $minutes = $totalMinutes % 60;
                $formattedTime = $hours > 0
                    ? "{$hours}hours {$minutes}mins"
                    : "{$minutes} mins";

                $firstRecord = $records->first();
                return [
                    'id' => $userId,
                    'full_name' => "{$firstRecord->creator?->first_name} {$firstRecord->creator?->last_name}",
                    'business_name' => $firstRecord->business?->business_name,
                    'rendered_minutes' => $totalMinutes,  // keep raw for calculations
                    'rendered_time' => $formattedTime,    // ✅ formatted for display
                ];
            })->values();

            return response()->json($employee);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getCalendarData(Request $request)
    {
        $userId = $request->user_id;

        $attendances = Attendance::where('user_id', $userId)
            ->whereNotNull('time_in')
            ->whereNotNull('time_out')
            ->get()
            ->map(function ($attendance) {
                $in = Carbon::parse($attendance->time_in);
                $out = Carbon::parse($attendance->time_out);
                $mins = $in->diffInMinutes($out);

                return [
                    'time_in' => $attendance->time_in,
                    'rendered_minutes' => $mins,
                ];
            });

        return response()->json($attendances);
    }
}
