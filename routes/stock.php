<?php

use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Stock\Auth\StockAuthController;
use App\Http\Controllers\Warehouse\Auth\WarehouseAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('stock')
    ->name('stock.')
    ->group(function () {

        Route::middleware('guest:stock')->group(function () {
            Route::get('/login', [StockAuthController::class, 'create'])
                ->name('login');

            Route::post('/login', [StockAuthController::class, 'store'])
                ->name('login.store');
        });

        Route::middleware('auth:stock')->group(function () {
            Route::post('/logout', [StockAuthController::class, 'destroy'])->name('logout');
            Route::get('{project}/cosulta',[StockController::class,'projectStock'])->name('index');
        });
        
    });
    