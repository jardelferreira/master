<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
{
    return Inertia::render(
        'dashboard/companies/Index',
        [
            'companies' => Company::query()
                ->latest()
                ->get()
                ->map(fn (Company $company) => [
                    'id' => $company->id,

                    'name' => $company->name,
                    'trade_name' => $company->trade_name,

                    'document' => $company->document,

                    'email' => $company->email,
                    'phone' => $company->phone,

                    'type' => $company->type->value,
                    'type_label' => $company->type->label(),

                    'active' => $company->active,

                    'created_at' => $company->created_at,
                    'updated_at' => $company->updated_at,
                ]),
        ]
    );
}

    public function store(
        StoreCompanyRequest $request
    ): RedirectResponse {
        Company::create(
            $request->validated()
        );

        return back()->with(
            'success',
            'Empresa cadastrada com sucesso.'
        );
    }

    public function update(
        UpdateCompanyRequest $request,
        Company $company
    ): RedirectResponse {
        $company->update(
            $request->validated()
        );

        return back()->with(
            'success',
            'Empresa atualizada com sucesso.'
        );
    }

    public function destroy(
        Company $company
    ): RedirectResponse {
        $company->delete();

        return back()->with(
            'success',
            'Empresa removida com sucesso.'
        );
    }
}
