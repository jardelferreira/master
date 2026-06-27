<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'project_id' => [
                'required',
                'exists:projects,id',
            ],

            'due_date' => [
                'nullable',
                'date',
            ],

            'notes' => [
                'nullable',
                'string',
            ],

            'user_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'user_ids.*' => [
                'integer',
                'exists:users,id',
            ],

            'stock_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'stock_ids.*' => [
                'integer',
                'exists:stocks,id',
            ],

            'blind_count' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    public function after(): array
    {
        return [
            function () {
                $this->validateUsers();
                $this->validateStocks();
            },
        ];
    }

    /**
     * Garante que todos os usuários pertencem ao projeto.
     */
    protected function validateUsers(): void
    {
        $project = \App\Models\Project::find(
            $this->project_id
        );

        if (! $project) {
            return;
        }

        $allowedUsers = $project
            ->users()
            ->pluck('users.id');

        $invalidUsers = collect($this->user_ids)
            ->diff($allowedUsers);

        if ($invalidUsers->isNotEmpty()) {
            $this->validator->errors()->add(
                'user_ids',
                'Existem usuários que não pertencem ao projeto.'
            );
        }
    }

    /**
     * Garante que todos os stocks pertencem ao projeto
     * (sem restrição de setor — inventário livre).
     */
    protected function validateStocks(): void
    {
        $allowedStocks = \App\Models\Stock::query()
            ->where('project_id', $this->project_id)
            ->where('active', true)
            ->pluck('id');

        $invalidStocks = collect($this->stock_ids)
            ->diff($allowedStocks);

        if ($invalidStocks->isNotEmpty()) {
            $this->validator->errors()->add(
                'stock_ids',
                'Existem itens que não pertencem ao projeto.'
            );
        }
    }
}