<?php

namespace App\Http\Requests;

use App\Models\Sector;
use App\Models\StockMinimal;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreStockMinimalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'project_id' => [
                'nullable',
                'integer',
                'exists:projects,id',
            ],

            'sector_id' => [
                'nullable',
                'integer',
                'exists:sectors,id',

                function (
                    string $attribute,
                    mixed $value,
                    Closure $fail
                ) {
                    if (! $value) {
                        return;
                    }

                    $sector = Sector::find($value);

                    if (! $sector) {
                        return;
                    }

                    if (
                        $this->project_id &&
                        (int) $sector->project_id !== (int) $this->project_id
                    ) {
                        $fail(
                            'O setor selecionado não pertence ao projeto informado.'
                        );
                    }
                },
            ],

            'min_quantity' => [
                'required',
                'numeric',
                'gt:0',
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $productId = $this->product_id;
            $projectId = $this->project_id;
            $sectorId = $this->sector_id;

            if (! $productId) {
                return;
            }

            $exists = StockMinimal::query()
                ->where('product_id', $productId)
                ->when(
                    $projectId,
                    fn ($q) => $q->where('project_id', $projectId),
                    fn ($q) => $q->whereNull('project_id')
                )
                ->when(
                    $sectorId,
                    fn ($q) => $q->where('sector_id', $sectorId),
                    fn ($q) => $q->whereNull('sector_id')
                )
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'product_id',
                    'Já existe uma configuração de estoque mínimo para este escopo.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'O produto é obrigatório.',
            'product_id.exists' => 'Produto inválido.',

            'project_id.exists' => 'Projeto inválido.',

            'sector_id.exists' => 'Setor inválido.',

            'min_quantity.required' => 'A quantidade mínima é obrigatória.',
            'min_quantity.numeric' => 'A quantidade mínima deve ser numérica.',
            'min_quantity.gt' => 'A quantidade mínima deve ser maior que zero.',
        ];
    }
}