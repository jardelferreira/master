import { ExportTable } from '../types';

/**
 * Opens a new browser window with a print-ready HTML table and triggers
 * the browser's print dialog.
 *
 * Columns flagged with meta.export.printable === false are excluded via
 * the `buildExportTable` caller (which should filter them before passing
 * the ExportTable here). This function works purely with the data it receives.
 */
export function printTable(exportTable: ExportTable): void {
    const { title, subtitle, company, generatedBy, generatedAt, columns, rows } =
        exportTable;

    const formattedDate = generatedAt.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const headerCells = columns
        .map(c => `<th>${escapeHtml(c.title)}</th>`)
        .join('');

    const bodyRows = rows
        .map(row => {
            const cells = row.values
                .map(v => `<td>${escapeHtml(String(v ?? ''))}</td>`)
                .join('');
            return `<tr>${cells}</tr>`;
        })
        .join('');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      color: #111;
      padding: 20mm 15mm;
    }

    .header {
      margin-bottom: 12px;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .header-left h1 {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
    }

    .header-left .subtitle {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }

    .header-right {
      text-align: right;
      font-size: 10px;
      color: #6b7280;
      line-height: 1.6;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }

    thead tr {
      background-color: #1e3a8a;
      color: #fff;
    }

    thead th {
      padding: 6px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    tbody tr:nth-child(even) { background-color: #f1f5f9; }
    tbody tr:nth-child(odd)  { background-color: #fff; }

    tbody td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }

    .footer {
      margin-top: 12px;
      font-size: 9px;
      color: #9ca3af;
      text-align: right;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
    }

    @media print {
      body { padding: 0; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<div class="subtitle">${escapeHtml(subtitle)}</div>` : ''}
    </div>
    <div class="header-right">
      ${company ? `<div>${escapeHtml(company)}</div>` : ''}
      ${generatedBy ? `<div>Gerado por: ${escapeHtml(generatedBy)}</div>` : ''}
      <div>${formattedDate}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>${headerCells}</tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>

  <div class="footer">
    Total de registros: ${rows.length}
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) {
        // Fallback: some browsers block window.open; warn and stop.
        console.warn('[DataTable] printTable: window.open was blocked by the browser.');
        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for assets (fonts, etc.) then print.
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Close after the dialog is dismissed.
        printWindow.onafterprint = () => printWindow.close();
    };
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}