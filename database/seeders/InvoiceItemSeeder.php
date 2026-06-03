<?php

namespace Database\Seeders;

use App\Enum\InvoiceStatusEnum;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\InvoiceItem;
use App\Services\InvoiceItemService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvoiceItemSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(InvoiceItemService::class);

        $invoices = Invoice::with([
            'provider',
            'project',
            'sector',
        ])
            ->where('status', InvoiceStatusEnum::COMPLETED)
            ->get();

        $products = Product::active()->get();

        if ($invoices->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach ($invoices as $invoice) {

            DB::transaction(function () use ($invoice, $products, $service) {

                $userId = $invoice->user_id;

                $invoiceProducts = $products
                    ->random(rand(1, min(5, $products->count())));

                foreach ($invoiceProducts as $product) {

                    $quantity = $this->generateQuantity($product->unit->value);

                    $unitPrice = fake()->randomFloat(
                        2,
                        5,
                        5000
                    );

                    $discount = fake()->boolean(25)
                        ? fake()->randomFloat(2, 0, $unitPrice * 0.10)
                        : 0;

                    $tax = fake()->randomFloat(2, 0, $unitPrice * 0.18);

                    $item = InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'product_id' => $product->id,
                        'provider_id' => $invoice->provider_id,
                        'user_id' => $userId,

                        'product_name' => $product->name,
                        'provider_name' => $invoice->provider->name,

                        'description' => fake()->sentence(),

                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'unit' => $product->unit->value,

                        'discount' => $discount,
                        'tax' => $tax,

                        'meta' => [
                            'seeded' => true,
                            'source' => 'invoice_item_seeder',
                        ],
                    ]);

                    $scenario = fake()->randomElement([
                        'full_delivery',
                        'partial_delivery',
                        'partial_with_rejection',
                    ]);

                    match ($scenario) {
                        'full_delivery' => $this->handleFullDelivery(
                            $service,
                            $item,
                            $quantity,
                            $userId
                        ),

                        'partial_delivery' => $this->handlePartialDelivery(
                            $service,
                            $item,
                            $quantity,
                            $userId
                        ),

                        'partial_with_rejection' => $this->handlePartialWithReject(
                            $service,
                            $item,
                            $quantity,
                            $userId
                        ),
                    };
                }

                $invoice->update([
                    'total' => $invoice->items()->sum('total'),
                ]);
            });
        }
    }

    private function handleFullDelivery(
        InvoiceItemService $service,
        InvoiceItem $item,
        float $quantity,
        int $userId
    ): void {
        $service->ship($item, $quantity, $userId);
        $service->receive($item, $quantity, $userId);
        $service->inspect($item, $quantity, $userId);
        $service->approve($item, $quantity, $userId);
        $service->sendToStock($item, $quantity, $userId);
    }

    private function handlePartialDelivery(
        InvoiceItemService $service,
        InvoiceItem $item,
        float $quantity,
        int $userId
    ): void {
        $q1 = round($quantity * 0.4, 3);
        $q2 = round($quantity - $q1, 3);

        $service->ship($item, $q1, $userId);
        $service->receive($item, $q1, $userId);
        $service->inspect($item, $q1, $userId);
        $service->approve($item, $q1, $userId);
        $service->sendToStock($item, $q1, $userId);

        $service->ship($item, $q2, $userId);
        $service->receive($item, $q2, $userId);
        $service->inspect($item, $q2, $userId);
        $service->approve($item, $q2, $userId);
        $service->sendToStock($item, $q2, $userId);
    }

    private function handlePartialWithReject(
        InvoiceItemService $service,
        InvoiceItem $item,
        float $quantity,
        int $userId
    ): void {
        $received = round($quantity * 0.7, 3);
        $rejected = round($received * 0.2, 3);
        $approved = round($received - $rejected, 3);

        $service->ship($item, $received, $userId);
        $service->receive($item, $received, $userId);
        $service->inspect($item, $received, $userId);

        if ($rejected > 0) {
            $service->reject($item, $rejected, $userId);
        }

        if ($approved > 0) {
            $service->approve($item, $approved, $userId);
            $service->sendToStock($item, $approved, $userId);
        }
    }

    private function generateQuantity(string $unit): float
    {
        return match ($unit) {

            'un', 'pc' => fake()->numberBetween(1, 50),

            'cx', 'kit', 'pkg' => fake()->numberBetween(1, 20),

            'kg' => fake()->randomFloat(3, 1, 500),

            'g' => fake()->randomFloat(3, 100, 5000),

            'm', 'mtl' => fake()->randomFloat(3, 1, 300),

            'm2' => fake()->randomFloat(3, 1, 200),

            'm3' => fake()->randomFloat(3, 1, 50),

            'l' => fake()->randomFloat(3, 1, 200),

            'ml' => fake()->randomFloat(3, 100, 5000),

            'par' => fake()->numberBetween(1, 20),

            'dz' => fake()->numberBetween(1, 10),

            'ton' => fake()->randomFloat(3, 1, 20),

            default => fake()->numberBetween(1, 10),
        };
    }
}
