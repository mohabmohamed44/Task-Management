import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportRequest, ExportResponse } from '@/domain/entities/export.dto';

export class PDFGenerator {
  async generate(data: any[], request: ExportRequest): Promise<ExportResponse> {
    const doc = new jsPDF();
    
    // Add autoTable plugin to jsPDF instance
    autoTable(doc, {});
    
    // Add title
    doc.setFontSize(16);
    doc.text('Task Export Report', 14, 15);
    
    // Add export date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Prepare table data
    const headers = request.columns || ['Title', 'Description', 'Priority', 'Category', 'Status', 'Due Date'];
    const tableData = data.map(task => {
      return headers.map(header => {
        switch(String(header).toLowerCase()) {
          case 'title': return task.title || '';
          case 'description': return task.description || '';
          case 'priority': return task.priority || '';
          case 'category': return task.category || '';
          case 'status': return task.completed ? 'Completed' : 'Pending';
          case 'due date': return task.dueDate || '';
          default: return task[header] || '';
        }
      });
    });
    
    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Generate blob and create download URL
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const fileName = `tasks_export_${Date.now()}.pdf`;
    
    return {
      url,
      fileName,
      mimeType: 'application/pdf'
    };
  }
}