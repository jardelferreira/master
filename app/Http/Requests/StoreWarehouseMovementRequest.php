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

            'destination_stock_id' => [
                'nullable',
                'integer',
                'exists:stocks,id',
            ],

            'destination_user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
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
                ! $this->filled('destination_stock_id')
            ) {
                $validator->errors()->add(
                    'destination_stock_id',
                    'O estoque destino é obrigatório.'
                );
            }

            if (
                $type === StockMovementTypeEnum::ASSIGNMENT->value &&
                ! $this->filled('destination_user_id')
            ) {
                $validator->errors()->add(
                    'destination_user_id',
                    'O usuário destino é obrigatório.'
                );
            }
        });
    }
}