<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsumeStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => [
                'required',
                'exists:projects,id',
            ],

            'employee_id' => [
                'required',
                'exists:employees,id',
            ],

            'team_id' => [
                'required',
                'exists:teams,id',
            ],

            'application_area_id' => [
                'exists:application_areas,id',
            ],

            'destination_user_id' => [
                'nullable',
                'exists:users,id',
            ],

            'consumptions' => [
                'required',
                'array',
                'min:1',
            ],

            'consumptions.*.stock_id' => [
                'required',
                'integer',
                'exists:stocks,id',
            ],

            'consumptions.*.quantity' => [
                'required',
                'numeric',
                'min:0.001',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}