import * as XLSX from 'xlsx';

import { ExportTable } from '../types';

import { getExportMatrix } from './helpers';

export function exportExcel(
    table: ExportTable,
    filename = 'export',
) {

    const worksheet =
        XLSX.utils.aoa_to_sheet(
            getExportMatrix(table),
        );

    worksheet['!cols'] =
        table.columns.map(col => ({
            wch: col.width ?? 20,
        }));

    worksheet['!autofilter'] = {
        ref: worksheet['!ref']!,
    };

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        table.title,
    );

    XLSX.writeFile(
        workbook,
        `${filename}.xlsx`,
    );

}