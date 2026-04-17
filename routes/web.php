<?php

use App\Http\Controllers\Admin\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

Route::inertia('/', 'welcome')->name('home');
Route::middleware('auth')->group(function (): void {
    Route::inertia('/home', 'Dashboard')->name('dashboard');
});

Route::get('/teste', function () {
    $user = User::where("id",2)->first();
    // $user->assignRole('super.admin');
    $user->active = !$user->active;
    $user->update();
    dd($user->active);
});

Route::get('show-invite/{invitation}',[UserController::class, 'showInvite'])->name('invitations.show');
Route::post('accept-invite/{invitation}', [UserController::class, 'acceptInvite'])->name('invitations.accept');