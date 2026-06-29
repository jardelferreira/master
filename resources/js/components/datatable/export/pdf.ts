import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import { ExportTable } from '../types';

export function exportPdf(
    table: ExportTable,
    filename='export',
){

    const pdf = new jsPDF({

        orientation:'landscape',

        unit:'mm',

        format:'a4',

    });

    pdf.setFontSize(18);

    pdf.text(
        table.title,
        14,
        15,
    );

    if(table.subtitle){

        pdf.setFontSize(11);

        pdf.text(
            table.subtitle,
            14,
            22,
        );

    }

    autoTable(pdf,{

        startY:30,

        head:[
            table.columns.map(c=>c.title)
        ],

        body:
            // table.rows.map returns unknown[][]. Cast to any to satisfy jspdf-autotable RowInput[] type
            table.rows.map(r => r.values as (string | number)[]),

        styles:{
            fontSize:9,
        },

        headStyles:{
            fillColor:[30,64,175],
        }

    });

    pdf.save(
        `${filename}.pdf`,
    );

}