<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;
use App\Models\User;

class SetupPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->input('id');
        return [
            'user_id' => $id ? [] : [
                'required'
            ],
            'current_password' => $id ? [
                'required',
            ] : [],
            'new_password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
            ],
            'confirm_password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
                'same:new_password'
            ],
        ];
    }

    /**
     * Custom validator for comparing current password.
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            // Fetch the user by ID
            $user = User::find($this->input('id'));

            // Check if password matches the stored hash
            if (!$user || !Hash::check($this->input('current_password'), $user->password)) {
                $validator->errors()->add('current_password', 'The current password is incorrect.');
            }
        });
    }
}
