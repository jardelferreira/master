<?php

namespace App\Support\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class LoginRateLimiter
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function key(Request $request): string
    {
        return Str::lower($request->input('email')) . '|' . $request->ip();
    }

    public function tooManyAttempts(Request $request, int $maxAttempts = 5): bool
    {
        return RateLimiter::tooManyAttempts(
            $this->key($request),
            $maxAttempts
        );
    }

    public function hit(Request $request): void
    {
        $key = $this->key($request);
        $attempts = RateLimiter::attempts($key);
        //  aumenta o tempo progressivamente
        $decay = min(300, 60 * ($attempts + 1)); // até 5 minutos
        RateLimiter::hit($key, $decay);
    }

    public function clear(Request $request): void
    {
        RateLimiter::clear($this->key($request));
    }

    public function availableIn(Request $request): int
    {
        return RateLimiter::availableIn($this->key($request));
    }
}
