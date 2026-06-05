<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;

use App\Models\Company;
use App\Models\Employee;
use App\Models\Occupation;

use Illuminate\Http\RedirectResponse;

use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render(
            'dashboard/employees/Index',
            [
                'employees' => Employee::query()
                    ->with([
                        'company',
                        'occupation',
                    ])
                    ->latest()
                    ->get()
                    ->map(fn(Employee $employee) => [
                        'id' => $employee->id,

                        'name' => $employee->name,

                        'email' => $employee->email,
                        'phone' => $employee->phone,
                        'cpf' => $employee->cpf,

                        'company_id' => $employee->company_id,
                        'occupation_id' => $employee->occupation_id,

                        'company_name' => $employee->company?->name,
                        'occupation_name' => $employee->occupation?->name,

                        'active' => $employee->active,

                        'created_at' => $employee->created_at,
                        'updated_at' => $employee->updated_at,
                    ]),

                'companies' => Company::query()
                    ->where('active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn(Company $company) => [
                        'id' => $company->id,
                        'name' => $company->name,
                    ]),

                'occupations' => Occupation::query()
                    ->where('active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn(Occupation $occupation) => [
                        'id' => $occupation->id,
                        'name' => $occupation->name,
                    ]),
            ]
        );
    }

    public function store(
        StoreEmployeeRequest $request
    ): RedirectResponse {
        Employee::create(
            $request->validated()
        );

        return back()->with(
            'success',
            'Colaborador cadastrado com sucesso.'
        );
    }

    public function update(
        UpdateEmployeeRequest $request,
        Employee $employee
    ): RedirectResponse {
        $employee->update(
            $request->validated()
        );

        return back()->with(
            'success',
            'Colaborador atualizado com sucesso.'
        );
    }

    public function destroy(
        Employee $employee
    ): RedirectResponse {
        $employee->delete();

        return back()->with(
            'success',
            'Colaborador removido com sucesso.'
        );
    }
}
