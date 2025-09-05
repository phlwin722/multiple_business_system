<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
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
            'first_name' => 'required|max:25',
            'last_name' => 'required|max:25',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id)
            ],
            'password' => $id ? [
                'nullable',
                Password::min(8)
                    ->symbols()
                    ->mixedCase()
                    ->numbers()
                    ->letters()
            ] : [
                'required',
                Password::min(8)
                    ->symbols()
                    ->mixedCase()
                    ->letters()
                    ->numbers()
            ],
            'position' => 'required',
            'image' => $id ? 'nullable|image|max:2048' : 'required|image|max:2048',
            'user_id' => 'required',
            'business_id' => 'required',
            'statuss' => 'nullable',
        ];
    }

    public function messages()
    {
        return [
            'business_id.required' => 'The business name field is required.',
        ];
    }
}
