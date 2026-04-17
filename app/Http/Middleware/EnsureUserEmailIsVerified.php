<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('fortify.email_verification')) {
            return $next($request);
        }

        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if (! $user instanceof MustVerifyEmail || $user->hasVerifiedEmail()) {
            return $next($request);
        }

        if ($request->routeIs($this->except())) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return new JsonResponse([
                'message' => 'Seu e-mail precisa ser verificado antes de continuar.',
            ], 409);
        }

        return new RedirectResponse(route('verification.notice'));
    }

    /**
     * Get the route names that should bypass email verification enforcement.
     *
     * @return array<int, string>
     */
    protected function except(): array
    {
        return [
            'home',
            'login',
            'login.store',
            'logout',
            'register',
            'register.store',
            'password.request',
            'password.email',
            'password.reset',
            'password.update',
            'verification.notice',
            'verification.verify',
            'verification.send',
        ];
    }
}
