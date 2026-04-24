<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockMinimalRequest;
use App\Http\Requests\UpdateStockMinimalRequest;
use App\Models\StockMinimal;
use Illuminate\Http\Request;

class StockMinimalController extends Controller
{
 public function index()
    {
        return StockMinimal::with(['product', 'project', 'sector'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'project_id' => 'nullable|exists:projects,id',
            'sector_id' => 'nullable|exists:sectors,id',
            'min_quantity' => 'required|numeric|min:0',
        ]);

        return StockMinimal::create($data);
    }

    public function show($id)
    {
        return StockMinimal::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $minimal = StockMinimal::findOrFail($id);

        $minimal->update($request->only([
            'min_quantity',
            'project_id',
            'sector_id'
        ]));

        return $minimal;
    }

    public function destroy($id)
    {
        StockMinimal::findOrFail($id)->delete();

        return response()->noContent();
    }
}
