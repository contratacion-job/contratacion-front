import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportToPDF(data: any[], columns: { key: string, label: string }[], title: string, logoUrl?: string): void {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Agregar logo si existe
    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        doc.addImage(img, 'JPEG', 14, 10, 30, 15);
        this.addPDFContent(doc, data, columns, title);
      };
      img.onerror = () => {
        this.addPDFContent(doc, data, columns, title);
      };
    } else {
      this.addPDFContent(doc, data, columns, title);
    }
  }

  private addPDFContent(doc: jsPDF, data: any[], columns: { key: string, label: string }[], title: string) {
    // Título
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 50, 20);

    // Fecha generación
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);
    doc.text(`Total de registros: ${data.length}`, 14, 35);

    // Preparar headers y datos
    const tableHeaders = columns.map(col => col.label);
    const tableData = data.map(row => columns.map(col => this.formatValue(row[col.key])));

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 45,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      margin: { top: 45, left: 14, right: 14, bottom: 20 },
      didDrawPage: (dataArg) => {
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);

        doc.text(
          `Página ${dataArg.pageNumber} de ${pageCount}`,
          14,
          pageHeight - 10
        );

        const systemText = 'Sistema Contratacion';
        const textWidth = doc.getTextWidth(systemText);
        const pageWidth = pageSize.width || pageSize.getWidth();
        doc.text(
          systemText,
          pageWidth - 14 - textWidth,
          pageHeight - 10
        );
      }
    });

    const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  exportToExcel(data: any[], columns: { key: string, label: string }[], fileName: string): void {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const csvRows = [];
    const headers = columns.map(col => col.label);
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = columns.map(col => {
        const val = this.formatValue(row[col.key]);
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES');
    }
    if (typeof value === 'number') {
      return value.toLocaleString('es-ES');
    }
    return value.toString();
  }
}
