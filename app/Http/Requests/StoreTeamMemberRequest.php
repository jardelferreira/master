<?php

namespace App\Http\Requests;

use App\Enum\TeamRoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'exists:employees,id',
            ],

            'role' => [
                'required',
                Rule::enum(
                    TeamRoleEnum::class
                ),
            ],

            'is_primary' => [
                'boolean',
            ],

            'active' => [
                'boolean',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_primary' => $this->boolean('is_primary'),
            'active' => $this->boolean('active', true),
        ]);
    }
}