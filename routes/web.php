<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FlowInvoiceController;
use App\Http\Controllers\FlowTestController;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\InvoiceItemMovement;
use App\Models\InvoiceMovement;
use App\Models\Product;
use App\Models\Project;
use App\Models\Sector;
use App\Models\Stock;
use Illuminate\Support\Facades\Route;


Route::inertia('/', 'welcome')->name('home');
Route::middleware('auth')->group(function (): void {
    Route::inertia('/home', 'Dashboard')->name('dashboard');
});
Route::get('flow',[FlowInvoiceController::class,'run']);
Route::get('/teste', function () {
    dd(Stock::selectRaw('product_id,project_id,sector_id, SUM(stock_quantity) as total')
    ->where('project_id',2)
    ->where('sector_id',9)
    ->with('product')
    ->groupBy(['project_id','sector_id','product_id'])
    ->get()->toArray(),
    Stock::where('invoice_id',56)->first()
    );
});

Route::get('show-invite/{invitation}',[UserController::class, 'showInvite'])->name('invitations.show');
Route::post('accept-invite/{invitation}', [UserController::class, 'acceptInvite'])->name('invitations.accept');