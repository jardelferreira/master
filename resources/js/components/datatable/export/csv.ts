import * as XLSX from 'xlsx';

import { ExportTable } from '../types';

import { getExportMatrix } from './helpers';

export function exportCsv(
    table: ExportTable,
    filename = 'export',
) {

    const worksheet =
        XLSX.utils.aoa_to_sheet(
            getExportMatrix(table),
        );

    const csv =
        XLSX.utils.sheet_to_csv(
            worksheet,
        );

    const blob = new Blob(
        [csv],
        {
            type:'text/csv;charset=utf-8;',
        },
    );

    const link =
        document.createElement('a');

    link.href =
        URL.createObjectURL(blob);

    link.download =
        `${filename}.csv`;

    link.click();

}