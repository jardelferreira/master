<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthenticateController extends Controller
{
    public function login(Request $request)
    {
        $key = Str::lower($request->email) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'email' => "Muitas tentativas. Tente novamente em {$seconds}s."
            ]);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            RateLimiter::hit($key, 60);

            return back()->withErrors([
                'email' => 'Credenciais inválidas.'
            ]);
        }

        RateLimiter::clear($key);

        return redirect()->intended('/dashboard');
    }
}
