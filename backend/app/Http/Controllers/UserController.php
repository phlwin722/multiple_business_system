<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgetPasswordRequest;
use App\Http\Requests\SetupPasswordRequest;
use Illuminate\Http\Request;
use App\Http\Requests\SignUpRequest;
use App\Http\Requests\SignInRequest;
use App\Models\User;
use App\Mail\ForgetPasswordMail;
use Illuminate\Support\Facades\Mail;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
public function register(SignUpRequest $signUpRequest)
    {
        try {

            $data = $signUpRequest->validated();
            $data['password'] = bcrypt($data['password']);
            $user = User::create($data);

            $user->update(['user_id' => $user->id]);

            return response()->json([
                'message' => 'Registered successfully'
            ], 201);
        } catch (\Exception $e) { 
            return response()->json([
                'error' => 'Something went wrong. Please try again later.'
            ], 500);
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

            if ($user->position != 'Admin') {
                Attendance::create([
                    'user_id' => $user->user_id,
                    'id_user_create' => $user->id,
                    'business_id' => $user->business_id,
                    'time_in' => now()
                ]);
            }

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'business_id' => $user->business_id,
                    'user_id' => $user->user_id,
                    'image' => $user->image ? asset($user->image) : null,
                    'business_image' => optional($user->business)->image ? asset($user->business->image) : null,
                    'position' => $user->position,
                    'email' => $user->email,
                    'business_id' => $user->business_id,
                    'business_name' => optional($user->business)->business_name,
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

            if ($user->position != 'Admin') {
                $latest = Attendance::where('id_user_create', $request->id)
                    ->whereNull('time_out')
                    ->orderByDesc('time_in')
                    ->first();

                $latest->update([
                    'time_out' => now()
                ]);
            }

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

            $generatedCode = (string) rand(100000, 900000);

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

    public function UpdatePassword(SetupPasswordRequest $request)
    {
        try {
            $data = $request->validated();
            $userID = $request->id ? $request->id : $request->user_id;

            $user = User::findOrFail($userID);

            $user->password = bcrypt($data['new_password']);
            $user->save();

            return response()->json([
                'message' => 'Password updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function UserUpdate(SignUpRequest $signupRequest, $id)
    {
        try {
            $data = $signupRequest->validated();
            $user = User::findOrFail($id);
            $user->update([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email']
            ]);

            if ($signupRequest->hasFile('image')) {

                // delete old image if exist
                if ($user->image) {
                    $oldImagePath = public_path($user->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath); // delete the file
                    }
                }

                // process to save the image
                $file = $signupRequest->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();

                // defint the folder path
                $folderPath = public_path('assets/employee/' . $user->id);

                // ensure the folder exits
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0755, true);
                }

                // move file to filder
                $file->move($folderPath, $filename);

                // correct url public access
                $filePath = "assets/employee/{$user->id}/{$filename}";

                $user->update(['image' => $filePath]);
            }

            return response()->json([
                'message' => 'Updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
