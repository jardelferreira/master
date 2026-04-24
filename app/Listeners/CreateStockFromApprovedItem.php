<?php

namespace App\Listeners;

use App\Events\InvoiceItemApproved;
use App\Services\StockService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateStockFromApprovedItem
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected StockService $stockService
    ) {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(InvoiceItemApproved $event): void
    {
        logger("EVENTO DISPARADO", [
            'item_id' => $event->item->id,
            'qty' => $event->quantity
        ]);
        $this->stockService->addFromInvoiceItem(
            $event->item,
            $event->quantity,
            $event->userId
        );
    }
}
