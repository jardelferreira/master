<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FlowInvoiceController;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Project;
use App\Models\Provider;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

Route::inertia('/', 'welcome')->name('home');
Route::middleware('auth')->group(function (): void {
    Route::inertia('/home', 'Dashboard')->name('dashboard');
});
Route::get('flow', [FlowInvoiceController::class, 'run']);
Route::get('/teste', function () {
    dd(Sector::find(7)->load('project'));
// Auth::user()->assignRole('super.admin');
// Auth::user()->projects()->syncWithoutDetaching([1]);

// dd(User::find(12)->roles, Project::find(2)->users);
// Auth::user()->projects()->syncWithoutDetaching([1]);
// dd(Auth::user()->projects, Project::all('id'));

});

Route::get('show-invite/{invitation}', [UserController::class, 'showInvite'])->name('invitations.show');
Route::post('accept-invite/{invitation}', [UserController::class, 'acceptInvite'])->name('invitations.accept');
