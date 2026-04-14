<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/login', 'auth/Login')->name('login');
Route::inertia('/register', 'auth/Register')->name('register');
Route::inertia('/forgot-password', 'auth/ForgotPassword')->name('password.request');
Route::inertia('/reset-password/{token}', 'auth/ResetPassword')->name('password.reset');

