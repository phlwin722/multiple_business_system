<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class SignupRequest extends FormRequest
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
     *F
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'first_name' => 'required|string|max:20',
            'last_name' => 'required|string|max:20',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'password' => $id ? [] : [
                'password' => [
                    'required',
                    Password::min(8)
                        ->mixedCase()
                        ->letters()
                        ->symbols()
                        ->numbers()
                ],
            ],
            'terms_agreement' => $id ? "" : 'required|accepted',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'terms_agreement.required' => 'You must accept the Terms & Conditions to continue.',
            'terms_agreement.accepted' => 'You must accept the Terms & Conditions to continue.',

        ];
    }
}
