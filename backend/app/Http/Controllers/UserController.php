<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgetPasswordRequest;
use App\Http\Requests\SetupPasswordRequest;
use Illuminate\Http\Request;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\SignInRequest;
use App\Models\User;
use App\Mail\ForgetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function register(SignUpRequest $signupRequest)
    {
        try {
            $data = $signupRequest->validated();
            $user = User::create($data);

            if ($user) {
                return response()->json([
                    'message' => 'Registered successfully'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function login(SignInRequest $signInRequest)
    {
        try {
            $data = $signInRequest->validated();

            if (!Auth::attempt($data)) {
                return response()->json([
                    'errors' => 'Invalid email address or password, please try again.'
                ], 423);
            }

            $user = Auth::user();
            $token = $user->createToken('access_token')->plainTextToken;

            $updateStatus = User::findOrFail($user->id);
            $updateStatus->update([
                'status' => 'Online',
                'updated_at' => now(),
            ]);

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'business_id' => $user->business_id,
                    'image' => asset($user->image),
                    'position' => $user->position,
                    'email' => $user->email,
                    'business_id' => $user->business_id,
                    'business_name' => $user->business->business_name ?? null,
                ],
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            $updateStatus = User::findOrFail($request->id);
            $updateStatus->update([
                'status' => 'Offline',
                'updated_at' => now(),
            ]);

            $user->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function email(ForgetPasswordRequest $forgetPasswordRequest)
    {
        try {
            $data = $forgetPasswordRequest->validated();

            $user = User::where('email', $data['email'])->first();

            if (!$user) {
                return response()->json([
                    'errors' => 'The provided email address does not exist in our records.'
                ], 421);
            }

            // generated 6 degit code
            $generatedCode = (string) rand(100000, 900000);

            // Build the email data
            $mailData = [
                'fullname' => $user->first_name . " " . $user->last_name,
                'email' => $user->email,
                'message' => "You have requested to reset your password. Please use the verification code below to proceed:\n\nCode: $generatedCode\n\nIf you did not request a password reset, please ignore this email.",
                'subject' => 'Reset Your Password'
            ];

            Mail::to($user->email)->send(new ForgetPasswordMail($mailData));

            return response()->json([
                'message' => 'Email sent successfully.',
                'user_id' => $user->id,
                'code' => $generatedCode
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function UpdatePassword(SetupPasswordRequest $setupPasswordRequest)
    {
        try {
            $data = $setupPasswordRequest->validated();

            $user = User::where('id', $data['user_id'])->update([
                'password' => bcrypt($data['new_password'])
            ]);

            if ($user) {
                return response()->json([
                    'message' => 'Updated sucessfully.'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
