<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;
use App\Services\InvoiceItemMovementService;

class InvoiceItemSeeder extends Seeder
{
    public function run(): void
    {
        $itemService = app(InvoiceItemMovementService::class);

        /*
        |--------------------------------------------------------------------------
        | 1. Buscar apenas invoices liberadas
        |--------------------------------------------------------------------------
        */
        $invoices = Invoice::where('status', 'completed')->get();
        $usersId = User::pluck('id');

        foreach ($invoices as $invoice) {

            /*
            |--------------------------------------------------------------------------
            | 2. Criar itens
            |--------------------------------------------------------------------------
            */
            $items = InvoiceItem::factory()
                ->count(rand(1, 5))
                ->for($invoice)
                ->create();
            $userId = $usersId->random();
            foreach ($items as $item) {

                /*
                |--------------------------------------------------------------------------
                | 3. Simular envio
                |--------------------------------------------------------------------------
                */
                $itemService->ship($item,$userId);

                /*
                |--------------------------------------------------------------------------
                | 4. Definir cenário
                |--------------------------------------------------------------------------
                */
                $scenario = fake()->randomElement([
                    'full',
                    'partial',
                    'partial_with_reject',
                ]);

                $total = (float) $item->quantity;

                switch ($scenario) {

                    /*
                    |--------------------------------------------------------------------------
                    | ENTREGA COMPLETA
                    |--------------------------------------------------------------------------
                    */
                    case 'full':

                        $itemService->receive($item, $total, $userId);
                        $itemService->inspect($item, $total, $userId);
                        $itemService->approve($item, $total, $userId);

                        break;

                    /*
                    |--------------------------------------------------------------------------
                    | ENTREGA PARCIAL
                    |--------------------------------------------------------------------------
                    */
                    case 'partial':

                        $q1 = round($total * 0.5, 2);
                        $q2 = $total - $q1;

                        $itemService->receive($item, $q1, $userId);
                        $itemService->inspect($item, $q1, $userId);
                        $itemService->approve($item, $q1, $userId);

                        $itemService->receive($item, $q2, $userId);
                        $itemService->inspect($item, $q2, $userId);
                        $itemService->approve($item, $q2, $userId);

                        break;

                    /*
                    |--------------------------------------------------------------------------
                    | PARCIAL COM REJEIÇÃO
                    |--------------------------------------------------------------------------
                    */
                    case 'partial_with_reject':

                        $q1 = round($total * 0.6, 2);
                        $qReject = round($total * 0.2, 2);
                        $qApprove = $q1 - $qReject;

                        // recebe tudo
                        $itemService->receive($item, $q1, $userId);

                        // inspeciona
                        $itemService->inspect($item, $q1, $userId);

                        // rejeita parte
                        $itemService->reject($item, $qReject);

                        // aprova restante
                        $itemService->approve($item, $qApprove, $userId);

                        break;
                }
            }
        }
    }
}