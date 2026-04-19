<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web','auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])
        ->middleware(['permission:users.create'])
        ->name('users.create');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware(['permission:users.create'])
        ->name('users.store');

    Route::delete('/users/delete/{user}',[UserController::class,'destroy'])->middleware(['permission:user.delete'])->name('users.destroy');

    Route::post('/users/invite', [UserController::class, 'invite'])->name('users.invite');
    Route::post('/users/toggle-status/{user}', [UserController::class, 'toggleStatus'])->name('users.toggleStatus');

    Route::get('/permissions',[PermissionController::class,'index'])->name('permissions');
    
    Route::get('/projects/show/{id}',[ProjectController::class,'show'])->name('projects.show');

});
