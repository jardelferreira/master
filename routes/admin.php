<?php

use App\Http\Controllers\Admin\ApplicationAreaController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\InvoiceItemController;
use App\Http\Controllers\Admin\InvoiceMovementController;
use App\Http\Controllers\Admin\OccupationController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProjectApplicationAreaController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectTeamController;
use App\Http\Controllers\Admin\ProviderController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\StockMinimalController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\UserInvitationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])
        ->middleware(['permission:users.create'])
        ->name('users.create');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware(['permission:users.create'])
        ->name('users.store');

    Route::delete('/users/delete/{user}', [UserController::class, 'destroy'])->middleware(['permission:user.delete'])->name('users.destroy');

    Route::post('/users/invite', [UserController::class, 'invite'])->name('users.invite');
    Route::get('/users/invitations', [UserInvitationController::class, 'getInvitations'])->name('users.invitatios.get');

    Route::post('/users/verification', [UserController::class, 'verifyEmail'])->name('users.verify.email');
    Route::post('/users/unverification', [UserController::class, 'unVerifyEmail'])->name('users.unverify.email');
    Route::post('/users/toggleverification/{user}', [UserController::class, 'toggleVerify'])->name('users.toggleverify');

    Route::post('/users/toggle-status/{user}', [UserController::class, 'toggleStatus'])->name('users.toggleStatus');
    Route::put('/users/update/profile/{user}', [UserController::class, 'update'])->name('users.update.profile');
    Route::put('/users/update/password/{user}', [UserController::class, 'updatePassword'])->name('users.update.password');
    Route::put('/users/update/email/{user}', [UserController::class, 'updateEmail'])->name('users.update.email');

    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions');
    Route::get('/permissions/create', [PermissionController::class, 'index'])->name('permissions.create');
    Route::get('/permissions/edit/{permission}', [PermissionController::class, 'index'])->name('permissions.edit');

    Route::post('/permissions/{permission}/users', [PermissionController::class, 'syncUsers'])->name('permissions.sync.users');
    Route::post('/permissions/{permission}/roles', [PermissionController::class, 'syncRoles'])->name('permissions.sync.roles');
    Route::post('/permissions/store', [PermissionController::class, 'store'])->name('permissions.store');
    Route::put('/permissions/{permission}/update', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{permission}/destroy', [PermissionController::class, 'destroy'])->name('permissions.destroy');

    Route::get('/projects/show/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('/projects/stock/{project}', [ProjectController::class, 'stock'])->name('projects.stock');
    Route::post('/projects/store', [ProjectController::class, 'store'])->name('projects.store');
    Route::delete('/projects/{project}/destroy', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::put('/projects/{project}/update', [ProjectController::class, 'update'])->name('projects.update');
    Route::post('/projects/{project}/users', [ProjectController::class, 'syncUsers'])->name('projects.sync.users');
    Route::post('/projects/{project}/create-sector', [ProjectController::class, 'createSector'])->name('projects.sectors.store');

    // Stock routes
    Route::get('projects/{project}/stock/pending-entries', [StockController::class, 'pendingEntries'])->name('stock.pending');
    Route::post('/stock/entries', [StockController::class, 'receiveEntries'])->name('stock.entries');
    Route::post('/stock/consume', [StockController::class, 'consume'])->name('stock.consume');

    Route::resource('invoices', InvoiceController::class);
    Route::get('invoices/{invoice}/items/create', [InvoiceItemController::class, 'create'])->name('invoices.items.create');
    Route::post('invoices/{invoice}/items/store', [InvoiceItemController::class, 'store'])->name('invoices.items.store');

    // itens
    Route::prefix('invoice-items')->group(function () {
        Route::post('{item}/receive', [InvoiceItemController::class, 'receive'])->name('invoices.items.receive');
        Route::post('{item}/inspect', [InvoiceItemController::class, 'inspect'])->name('invoices.items.inspect');
        Route::post('{item}/approve', [InvoiceItemController::class, 'approve'])->name('invoices.items.approve');
        Route::post('{item}/reject', [InvoiceItemController::class, 'reject'])->name('invoices.items.reject');
        Route::post('{item}/forceSendToStock', [InvoiceItemController::class, 'forceSendToStock'])->name('invoices.items.forceSendToStock');
    });

    // financeiro
    Route::prefix('invoices/{invoice}')->group(function () {
        Route::post('pay', [InvoiceMovementController::class, 'pay'])->name('invoices.pay');
        Route::post('complete', [InvoiceMovementController::class, 'complete'])->name('invoices.complete');
        Route::post('cancel', [InvoiceMovementController::class, 'cancel'])->name('invoices.cancel');
    });

    // fornecedores
    Route::get('providers', [ProviderController::class, 'index'])->name('providers.index');
    Route::post('providers', [ProviderController::class, 'store'])->name('providers.store');
    Route::prefix('providers/{provider}')->group(function () {
        Route::get('/', [ProviderController::class, 'show'])->name('providers.show');
        Route::put('/', [ProviderController::class, 'update'])->name('providers.update');
        Route::delete('/', [ProviderController::class, 'destroy'])->name('providers.destroy');
        Route::post('toggle-status', [ProviderController::class, 'toggleStatus'])->name('providers.toggleStatus');
    });

    Route::prefix('categories')
        ->name('categories.')
        ->controller(CategoryController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');

            Route::get('/{category}', 'show')->name('show');
            Route::put('/{category}', 'update')->name('update');
            Route::delete('/{category}', 'destroy')->name('destroy');

            Route::post('/{category}/toggle-status', 'toggleStatus')->name('toggleStatus');
        });

    Route::prefix('products')
        ->name('products.')
        ->controller(ProductController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');

            Route::get('/search', 'search')->name('search');
            Route::get('/{product}', 'show')->name('show');
            Route::put('/{product}', 'update')->name('update');
            Route::delete('/{product}', 'destroy')->name('destroy');

            Route::post('/{product}/toggle-status', 'toggleStatus')->name('toggleStatus');
        });

    Route::prefix('stock-minimals')
        ->name('stock-minimals.')
        ->controller(StockMinimalController::class)
        ->group(function () {
            Route::post('/', 'store')->name('store');
            Route::put('/{stockMinimal}', 'update')->name('update');
            Route::delete('/{stockMinimal}', 'destroy')->name('destroy');
        });

    Route::prefix('settings')
        ->name('settings.')
        ->group(function () {

            Route::resource(
                'occupations',
                OccupationController::class
            )->only([
                'index',
                'store',
                'update',
                'destroy',
            ]);

            Route::resource(
                'companies',
                CompanyController::class
            )->only([
                'index',
                'store',
                'update',
                'destroy',
            ]);

            Route::resource(
                'employees',
                EmployeeController::class
            )->except([
                'create',
                'show',
                'edit',
            ]);

            Route::resource(
                'teams',
                TeamController::class
            )->except([
                'create',
                'show',
                'edit',
            ]);

            Route::prefix('teams/{team}')
                ->name('teams.')
                ->group(function () {

                    Route::get(
                        'members',
                        [TeamMemberController::class, 'index']
                    )->name('members.index');

                    Route::post(
                        'members',
                        [TeamMemberController::class, 'store']
                    )->name('members.store');

                    Route::put(
                        'members/{employee}',
                        [TeamMemberController::class, 'update']
                    )->name('members.update');

                    Route::delete(
                        'members/{employee}',
                        [TeamMemberController::class, 'destroy']
                    )->name('members.destroy');
                });
            Route::get(
                'teams/tree',
                [TeamController::class, 'tree']
            )->name('teams.tree');
            Route::get(
                'teams/org-chart',
                [TeamController::class, 'orgChart']
            )->name('teams.org-chart');

            Route::resource(
                'application-areas',
                ApplicationAreaController::class
            )->except([
                'create',
                'show',
                'edit',
            ]);
        });
    Route::post(
        'occupations/{occupation}/toggle-status',
        [OccupationController::class, 'toggleStatus']
    )->name('occupations.toggleStatus');

    Route::prefix('projects/{project}')
        ->group(function () {

            Route::get(
                'teams',
                [
                    ProjectTeamController::class,
                    'index',
                ]
            )->name(
                'projects.teams.index'
            );

            Route::post(
                'teams',
                [
                    ProjectTeamController::class,
                    'store',
                ]
            )->name(
                'projects.teams.store'
            );

            Route::delete(
                'teams/{team}',
                [
                    ProjectTeamController::class,
                    'destroy',
                ]
            )->name(
                'projects.teams.destroy'
            );
        });

    Route::post(
        'projects/{project}/application-areas',
        [
            ProjectApplicationAreaController::class,
            'store',
        ],
    )->name(
        'projects.application-areas.store'
    );

    Route::delete(
        'projects/{project}/application-areas/{applicationArea}',
        [
            ProjectApplicationAreaController::class,
            'destroy',
        ],
    )->name(
        'projects.application-areas.destroy'
    );
});
