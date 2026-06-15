<?php

namespace App\Http\Controllers\Stock\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warehouse\LoginWarehouseRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StockAuthController extends Controller
{
     public function create(): Response
    {
        return Inertia::render('stock/auth/Login');
    }

    public function store(
        LoginWarehouseRequest $request
    ): RedirectResponse {
        $credentials = $request->only([
            'email',
            'password',
        ]);

        $remember = (bool) $request->boolean('remember');

        if (! Auth::guard('stock')->attempt($credentials, $remember)) {
            return back()->withErrors([
                'email' => 'Credenciais inválidas.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->route('stock.index');
    }

    public function destroy(): RedirectResponse
    {
        Auth::logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('stock.login');
    }
}
