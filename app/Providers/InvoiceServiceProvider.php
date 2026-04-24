<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class InvoiceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Event::listen(
        //     InvoiceItemApproved::class,CreateStockFromApprovedItem::class
        // );
    }
}
