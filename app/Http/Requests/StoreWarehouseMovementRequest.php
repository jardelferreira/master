<?php

namespace App\Http\Requests;

use App\Enum\StockMovementTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreWarehouseMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => [
                'required',
                'string',
                Rule::in([
                    StockMovementTypeEnum::CONSUMPTION->value,
                    StockMovementTypeEnum::TRANSFER->value,
                    StockMovementTypeEnum::ASSIGNMENT->value,
                    StockMovementTypeEnum::ADJUST->value,
                    StockMovementTypeEnum::RETURN->value,
                    StockMovementTypeEnum::LOSS->value,
                ]),
            ],

            'stock_id' => [
                'required',
                'integer',
                'exists:stocks,id',
            ],

            'quantity' => [
                'nullable',
                'numeric',
                'gt:0',
            ],

            'new_quantity' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'destination_sector_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:sectors,id',
            ],

            'destination_user_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'employee_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:employees,id',
            ],

            'team_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:teams,id',
            ],

            'application_area_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:application_areas,id',
            ],
            'movement_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:stock_movements,id',
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $type = $this->string('type')->value();

            if (
                in_array($type, [
                    StockMovementTypeEnum::CONSUMPTION->value,
                    StockMovementTypeEnum::TRANSFER->value,
                    StockMovementTypeEnum::ASSIGNMENT->value,
                    StockMovementTypeEnum::RETURN->value,
                    StockMovementTypeEnum::LOSS->value,
                ]) &&
                ! $this->filled('quantity')
            ) {
                $validator->errors()->add(
                    'quantity',
                    'A quantidade é obrigatória.'
                );
            }

            if (
                $type === StockMovementTypeEnum::ADJUST->value &&
                ! $this->filled('new_quantity')
            ) {
                $validator->errors()->add(
                    'new_quantity',
                    'A nova quantidade é obrigatória.'
                );
            }

            if (
                $type === StockMovementTypeEnum::TRANSFER->value &&
                ! $this->filled('destination_sector_id')
            ) {
                $validator->errors()->add(
                    'destination_sector_id',
                    'O Setor destino é obrigatório.'
                );
            }

            if (
                $type === StockMovementTypeEnum::TRANSFER->value &&
                ! $this->filled('destination_user_id')
            ) {
                $validator->errors()->add(
                    'destination_user_id',
                    'O responsável destino é obrigatório.'
                );
            }

            if (
                $type ===
                StockMovementTypeEnum::ASSIGNMENT->value
            ) {

                if (! $this->filled('employee_id')) {
                    $validator->errors()->add(
                        'employee_id',
                        'O colaborador é obrigatório.'
                    );
                }

                if (! $this->filled('team_id')) {
                    $validator->errors()->add(
                        'team_id',
                        'A equipe é obrigatória.'
                    );
                }
            }
            if (
                $type ===
                StockMovementTypeEnum::CONSUMPTION->value
            ) {

                if (! $this->filled('employee_id')) {
                    $validator->errors()->add(
                        'employee_id',
                        'O colaborador é obrigatório.'
                    );
                }

                if (! $this->filled('team_id')) {
                    $validator->errors()->add(
                        'team_id',
                        'A equipe é obrigatória.'
                    );
                }

                if (! $this->filled('application_area_id')) {
                    $validator->errors()->add(
                        'application_area_id',
                        'A área de aplicação é obrigatória.'
                    );
                }
            }

            if (
                $type ===
                StockMovementTypeEnum::RETURN->value
            ) {

                if (! $this->filled('movement_id')) {
                    $validator->errors()->add(
                        'movement_id',
                        'A movimentação de origem é obrigatória.'
                    );
                }

            }
        });
    }
}
