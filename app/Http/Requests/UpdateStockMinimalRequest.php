<?php

namespace App\Http\Requests;

use App\Models\Sector;
use App\Models\StockMinimal;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateStockMinimalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
            $stockMinimal = $this->route('stockMinimal');

            if (! $stockMinimal) {
                return;
            }

            $exists = StockMinimal::query()
                ->where('product_id', $stockMinimal->product_id)
                ->where('id', '!=', $stockMinimal->id)
                ->when(
                    $this->project_id,
                    fn ($q) => $q->where('project_id', $this->project_id),
                    fn ($q) => $q->whereNull('project_id')
                )
                ->when(
                    $this->sector_id,
                    fn ($q) => $q->where('sector_id', $this->sector_id),
                    fn ($q) => $q->whereNull('sector_id')
                )
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'sector_id',
                    'Já existe uma configuração para este escopo.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'project_id.exists' => 'Projeto inválido.',
            'sector_id.exists' => 'Setor inválido.',

            'min_quantity.required' => 'A quantidade mínima é obrigatória.',
            'min_quantity.numeric' => 'A quantidade mínima deve ser numérica.',
            'min_quantity.gt' => 'A quantidade mínima deve ser maior que zero.',
        ];
    }
}