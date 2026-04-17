<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['guest','throttle:5,1'])->group(function() {
    Route::get('/login',function(){
        return Inertia::render('auth/Login');
    })->name('login');
    // Route::inertia('/login', 'auth/Login')->name('login');

});
Route::inertia('/register', 'auth/Register')->name('register');
Route::inertia('/forgot-password', 'auth/ForgotPassword')->name('password.request');
Route::inertia('/reset-password/{token}', 'auth/ResetPassword')->name('password.reset');

Route::middleware('auth')->group(function () {

    Route::get('/email/verify', function () {
        if (! config('fortify.email_verification')) {
            return redirect()->route('dashboard');
        }

        if (request()->user()?->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/VerifyEmail');
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        if (! config('fortify.email_verification')) {
            return redirect()->route('dashboard');
        }

        $request->fulfill();

        return redirect()->route('dashboard')->with('feedback', [
            'success' => true,
            'status' => 'success',
            'message' => 'E-mail verificado com sucesso.',
            'type' => 'toast',
        ]);
    })->middleware(['signed'])->name('verification.verify');

    Route::post('/email/verification-notification', function (Request $request) {
        if (! config('fortify.email_verification')) {
            return redirect()->route('dashboard');
        }

        if ($request->user()?->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('feedback', [
            'success' => true,
            'status' => 'success',
            'message' => 'Novo link de verificacao enviado para o seu e-mail.',
            'type' => 'toast',
        ]);
    })->middleware(['throttle:6,1'])->name('verification.send');
});
