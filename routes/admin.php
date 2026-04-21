<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProjectController;
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
    Route::post('/projects/store', [ProjectController::class, 'store'])->name('projects.store');
    Route::delete('/projects/{project}/destroy', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::put('/projects/{project}/update', [ProjectController::class, 'update'])->name('projects.update');
    Route::post('/projects/{project}/users', [ProjectController::class, 'syncUsers'])->name('projects.sync.users');
    Route::post('/projects/{project}/create-sector', [ProjectController::class, 'createSector'])->name('projects.sectors.store');
});
