export function InvoiceHeader({ invoice }: {invoice:any}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-lg font-semibold">
                    NF {invoice.number}/{invoice.series}
                </h1>
                <p className="text-sm text-slate-400">
                    {invoice.provider.trade_name}
                </p>
            </div>

            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600">
                {invoice.status}
            </span>
        </div>
    )
}