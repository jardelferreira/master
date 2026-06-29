import {
    ChevronDown,
    Download,
    FileSpreadsheet,
    FileText,
    Printer,
} from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Dropdown } from '@/components/ui/dropdown';

import {
    buildExportTable,
    exportCsv,
    exportExcel,
    exportPdf,
    printTable,
} from '../export';

import { DataTableExportOptions } from '../types';

interface Props<T> {
    table: Table<T>;
    options?: DataTableExportOptions;
}

export function DataTableExportMenu<T>({ table, options }: Props<T>) {
    if (!options) return null;

    const hasAnyExport =
        options.excel || options.csv || options.pdf || options.print;

    if (!hasAnyExport) return null;

    const filename = options.filename ?? 'export';

    const buildTable = () =>
        buildExportTable(table, {
            title: options.title,
            subtitle: options.subtitle,
            company: options.company,
            project: options.project,
            logo: options.logo,
            generatedBy: options.generatedBy,
        });

    return (
        <Dropdown.Root
            trigger={
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-800">
                    <Download size={14} />
                    Exportar
                    <ChevronDown size={13} className="text-slate-400" />
                </button>
            }
        >
            {options.excel && (
                <Dropdown.Item
                    icon={<FileSpreadsheet size={15} className="text-green-600" />}
                    onClick={() => exportExcel(buildTable(), filename)}
                >
                    Excel (.xlsx)
                </Dropdown.Item>
            )}

            {options.csv && (
                <Dropdown.Item
                    icon={<FileText size={15} className="text-blue-500" />}
                    onClick={() => exportCsv(buildTable(), filename)}
                >
                    CSV
                </Dropdown.Item>
            )}

            {options.pdf && (
                <Dropdown.Item
                    icon={<FileText size={15} className="text-red-500" />}
                    onClick={() => exportPdf(buildTable(), filename)}
                >
                    PDF
                </Dropdown.Item>
            )}

            {(options.excel || options.csv || options.pdf) && options.print && (
                <Dropdown.Divider />
            )}

            {options.print && (
                <Dropdown.Item
                    icon={<Printer size={15} className="text-slate-500" />}
                    onClick={() => printTable(buildTable())}
                >
                    Imprimir
                </Dropdown.Item>
            )}
        </Dropdown.Root>
    );
}