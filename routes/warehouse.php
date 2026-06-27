<?php

use App\Http\Controllers\Warehouse\Auth\WarehouseAuthController;
use App\Http\Controllers\Warehouse\WarehouseDashboardController;
use App\Http\Controllers\Warehouse\WarehouseMovementController;
use App\Http\Controllers\Warehouse\WarehouseStockController;
use App\Http\Controllers\Warehouse\InventoryConferenciaController;
use Illuminate\Support\Facades\Route;

Route::prefix('warehouse')
    ->name('warehouse.')
    ->group(function () {

        Route::middleware('guest:warehouse')->group(function () {
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
            )->name('projects.movements.returnable');

            Route::prefix('inventories')
                ->name('inventories.')
                ->controller(InventoryConferenciaController::class)
                ->group(function () {
                    Route::get('/', 'index')
                        ->name('index');
                    Route::get('/{inventory}', 'show')
                        ->name('show');
                    Route::put('/items/{inventoryItem}', 'updateItem')
                        ->name('items.update');
                });
        });
    });

use App\Http\Controllers\Warehouse\StockConsultaController;

Route::middleware('auth:stock')->group(function () {
    Route::prefix('stocks/{project}')

        ->name('warehouse.projects.')
        ->group(function () {

            // Consulta de estoque (read-only, mobile-first)
            Route::get('/consulta', [StockConsultaController::class, 'index'])
                ->name('consulta');

            // AJAX: histórico de movimentações de um produto
            Route::get('/consulta/movements/{productId}', [StockConsultaController::class, 'movements'])
                ->name('consulta.movements');
        });
});
