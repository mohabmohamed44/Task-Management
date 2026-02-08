import * as XLSX from 'xlsx';
import type { ExportRequest, ExportResponse } from '@/domain/entities/export.dto';

export class ExcelGenerator {
  async generate(data: any[], request: ExportRequest): Promise<ExportResponse> {
    // Prepare headers
    const headers = request.columns || ['Title', 'Description', 'Priority', 'Category', 'Status', 'Due Date'];
    
    // Prepare data
    const tableData = data.map(task => {
      const row: any = {};
      headers.forEach(header => {
        switch(String(header).toLowerCase()) {
          case 'title': row[header] = task.title || ''; break;
          case 'description': row[header] = task.description || ''; break;
          case 'priority': row[header] = task.priority || ''; break;
          case 'category': row[header] = task.category || ''; break;
          case 'status': row[header] = task.completed ? 'Completed' : 'Pending'; break;
          case 'due date': row[header] = task.dueDate || ''; break;
          default: row[header] = task[header] || ''; break;
        }
      });
      return row;
    });
    
    // Create workbook
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    
    // Generate file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const fileName = `tasks_export_${Date.now()}.xlsx`;
    
    return {
      url,
      fileName,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }
}