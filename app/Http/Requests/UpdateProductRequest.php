<?php

namespace App\Http\Requests;

use App\Enum\ProductUnitEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')
                    ->ignore($product?->id),
            ],

            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],

            'unit' => [
                'required',
                new Enum(ProductUnitEnum::class),
            ],

            'active' => [
                'required',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do produto é obrigatório.',
            'name.max' => 'O nome do produto deve ter no máximo 255 caracteres.',

            'description.max' => 'A descrição deve ter no máximo 2000 caracteres.',

            'sku.unique' => 'Já existe um produto com este SKU.',
            'sku.max' => 'O SKU deve ter no máximo 100 caracteres.',

            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada é inválida.',

            'unit.required' => 'A unidade é obrigatória.',

            'active.required' => 'O status do produto é obrigatório.',
        ];
    }
}
