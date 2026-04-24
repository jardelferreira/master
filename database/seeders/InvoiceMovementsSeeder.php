<?php

namespace Database\Seeders;

use App\Enum\InvoiceMovementEnum;
use App\Models\Invoice;
use App\Models\InvoiceMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvoiceMovementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $invoices = Invoice::all();

        foreach ($invoices as $invoice) {

            // fluxo básico
            InvoiceMovement::create([
                'uuid' => Str::uuid(),
                'invoice_id' => $invoice->id,
                'type' => InvoiceMovementEnum::RECEIVED->value,
                'performed_at' => now()->subDays(3),
            ]);

            InvoiceMovement::create([
                'uuid' => Str::uuid(),
                'invoice_id' => $invoice->id,
                'type' => InvoiceMovementEnum::INSPECTED->value,
                'performed_at' => now()->subDays(2),
            ]);

            // algumas aprovadas
            if (rand(0, 1)) {
                InvoiceMovement::create([
                    'uuid' => Str::uuid(),
                    'invoice_id' => $invoice->id,
                    'type' => InvoiceMovementEnum::APPROVED->value,
                    'is_approved' => true,
                    'performed_at' => now()->subDay(),
                ]);

                // sincroniza status da invoice
                $invoice->update([
                    'status' => \App\Enum\InvoiceStatusEnum::APPROVED->value
                ]);
            }
        }
    }
}
