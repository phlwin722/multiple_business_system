<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
            'product_name' => [
                "required",
                "max:15",
                Rule::unique('products', 'product_name')->ignore($id)
            ],
            'price' => 'required',
            'quantity' => 'required',
            'image' => $id ? 'nullable|image|max:2048' : 'required|image|max:2048',
            'business_id' => 'required',
            'user_id' => 'required',
        ];
    }

    public function messages () {
        return [
            'business_id.required' => 'The business field is required.'
        ];
    }
}
