<?php

use App\Http\Controllers\Warehouse\Auth\WarehouseAuthController;
use App\Http\Controllers\Warehouse\WarehouseDashboardController;
use App\Http\Controllers\Warehouse\WarehouseMovementController;
use App\Http\Controllers\Warehouse\WarehouseStockController;
use Illuminate\Support\Facades\Route;

Route::prefix('warehouse')
    ->name('warehouse.')
    ->group(function () {

        Route::middleware('warehouse')->group(function () {
            Route::get('/login', [WarehouseAuthController::class, 'create'])
                ->name('login');

            Route::post('/login', [WarehouseAuthController::class, 'store'])
                ->name('login.store');
        });

        Route::middleware('auth:warehouse')->group(function () {
            Route::post('/logout', [WarehouseAuthController::class, 'destroy'])
                ->name('logout');

            Route::get('/', [WarehouseDashboardController::class, 'show'])
                ->name('index');

            Route::get('/projects/{project}', [WarehouseDashboardController::class, 'show'])
                ->name('projects.show');

            Route::get('/projects/{project}/stocks', [WarehouseStockController::class, 'index'])
                ->name('projects.stocks');

            Route::post('/projects/{project}/movements', [WarehouseMovementController::class, 'store'])
                ->name('projects.movements.store');
        Route::get(
            '/projects/{project}/stocks/{stock}/transfer-options',
            [WarehouseStockController::class, 'transferOptions']
        )->name('projects.transfer-options');

        Route::get(
            '/projects/{project}/users',
            [WarehouseDashboardController::class, 'users']
        )->name('projects.users');


        Route::get(
            '/projects/{project}/movements',
            [WarehouseMovementController::class, 'index']
        )->name('projects.movements.index');

        Route::get(
            '/projects/{project}/warehouse/movements/returnable',
            [
                WarehouseMovementController::class,
                'returnableMovements',
            ]
        )->name('projects.movements.returnable' );

        });
        
    });
