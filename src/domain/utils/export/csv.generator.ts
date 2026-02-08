import type { ExportRequest, ExportResponse } from '@/domain/entities/export.dto';

export class CSVGenerator {
  async generate(data: any[], request: ExportRequest): Promise<ExportResponse> {
    // Prepare headers
    const headers = request.columns || ['Title', 'Description', 'Priority', 'Category', 'Status', 'Due Date'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(task => {
      const row = headers.map(header => {
        let value = '';
        switch(String(header).toLowerCase()) {
          case 'title': value = task.title || ''; break;
          case 'description': value = task.description || ''; break;
          case 'priority': value = task.priority || ''; break;
          case 'category': value = task.category || ''; break;
          case 'status': value = task.completed ? 'Completed' : 'Pending'; break;
          case 'due date': value = task.dueDate || ''; break;
          default: value = task[header] || ''; break;
        }
        
        // Escape commas and quotes in values
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and URL
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const fileName = `tasks_export_${Date.now()}.csv`;
    
    return {
      url,
      fileName,
      mimeType: 'text/csv'
    };
  }
}