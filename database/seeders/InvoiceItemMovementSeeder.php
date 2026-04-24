<?php

namespace Database\Seeders;

use App\Enum\InvoiceItemMovementReasonEnum;
use App\Enum\InvoiceMovementEnum;
use App\Models\InvoiceItem;
use App\Models\InvoiceItemMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvoiceItemMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $items = InvoiceItem::with('invoice')->get();

        foreach ($items as $item) {

            $total = $item->quantity;

            // 📥 RECEBIDO (parcial ou total)
            $received = rand(1, $total);

            InvoiceItemMovement::create([
                'uuid' => Str::uuid(),
                'invoice_item_id' => $item->id,
                'quantity' => $received,
                'type' => InvoiceMovementEnum::RECEIVED->value,
                'performed_at' => now()->subDays(2),
            ]);

            // 🔍 INSPEÇÃO
            InvoiceItemMovement::create([
                'uuid' => Str::uuid(),
                'invoice_item_id' => $item->id,
                'quantity' => $received,
                'type' => InvoiceMovementEnum::INSPECTED->value,
                'performed_at' => now()->subDay(),
            ]);

            // ❌ POSSÍVEL REJEIÇÃO
            if (rand(0, 1)) {

                $rejected = rand(1, $received);

                InvoiceItemMovement::create([
                    'uuid' => Str::uuid(),
                    'invoice_item_id' => $item->id,
                    'quantity' => $rejected,
                    'type' => InvoiceMovementEnum::REJECTED->value,
                    'reason' => fake()->randomElement(InvoiceItemMovementReasonEnum::cases())->value,
                    'performed_at' => now(),
                ]);

                $received -= $rejected;
            }

            // ✅ APROVADO (restante)
            if ($received > 0) {
                InvoiceItemMovement::create([
                    'uuid' => Str::uuid(),
                    'invoice_item_id' => $item->id,
                    'quantity' => $received,
                    'type' => InvoiceMovementEnum::APPROVED->value,
                    'performed_at' => now(),
                ]);
            }
        }
    }
}
