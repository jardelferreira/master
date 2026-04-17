<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use App\Support\Auth\LoginRateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;


class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        RateLimiter::for('login', function (Request $request) {

            $email = Str::lower($request->input('email'));
            $ip = $request->ip();
            return [
                // Limite por email + IP (principal)
                Limit::perMinute(5)->by($email . '|' . $ip)->response(function ($request, $headers) {
                    return Inertia::render('errors/429', [
                        'retryAfter' => $headers['Retry-After'] ?? 60,
                    ])->toResponse($request)->setStatusCode(429);
                }),
                // Limite por IP global (protege ataques distribuídos)
                Limit::perMinute(20)->by($ip)->response(function ($request, $headers) {
                    return Inertia::render('errors/429', [
                        'retryAfter' => $headers['Retry-After'] ?? 60,
                    ])->toResponse($request)->setStatusCode(429);
                }),
                // Limite só por email (protege ataque direcionado)
                Limit::perMinute(10)->by($email)->response(function ($request, $headers) {
                    return Inertia::render('errors/429', [
                        'retryAfter' => $headers['Retry-After'] ?? 60,
                    ])->toResponse($request)->setStatusCode(429);
                }),
            ];
        });

        Fortify::authenticateUsing(function (Request $request) {
            $limiter = app(LoginRateLimiter::class);

            if ($limiter->tooManyAttempts($request)) {
                Log::warning('Brute force detectado', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                ]);

                $seconds = $limiter->availableIn($request);

                throw ValidationException::withMessages([
                    'throttle' => $seconds

                ]);
            }
            usleep(random_int(200000, 500000)); // 200ms–500ms delay para difilcutar altomações
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                $limiter->clear($request);
                return $user;
            }

            $limiter->hit($request, 60);

            return null;
        });
    }
}
