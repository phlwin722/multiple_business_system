<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;

abstract class Controller
{
    public function create (UserRequest $userRequest) {
        try {
            $data = $userRequest->validated();
            $user = User::create($data);
            if ($data) {
                return response()->json([
                    'user' => $user,
                    'message' => 'Created successfully'
                ]);
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
