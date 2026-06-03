<?php

namespace App\Http\Requests;

use App\Models\Category;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',

                function (string $attribute, mixed $value, Closure $fail) use ($category) {
                    if (!$value || !$category) {
                        return;
                    }

                    // não pode ser pai de si mesma
                    if ((int) $value === (int) $category->id) {
                        $fail('Uma categoria não pode ser pai dela mesma.');
                        return;
                    }

                    // evita loop recursivo
                    $parent = Category::find($value);

                    while ($parent) {
                        if ((int) $parent->id === (int) $category->id) {
                            $fail('Não é possível criar um ciclo na hierarquia de categorias.');
                            return;
                        }

                        $parent = $parent->parent;
                    }
                },
            ],

            'active' => [
                'required',
                'boolean',
            ],
        ];
    }
}
