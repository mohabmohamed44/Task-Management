import type { ExportRequest, ExportResponse } from '@/domain/entities/export.dto';
import { PDFGenerator } from '@/domain/utils/export/pdf.generator';
import { ExcelGenerator } from '@/domain/utils/export/excel.generator';
import { CSVGenerator } from '@/domain/utils/export/csv.generator';
import { GetTasksUseCase, GetTaskByIdUseCase } from '../task.usecases';

export class ExportTasksUseCase {
  constructor(
    private pdfGenerator: PDFGenerator = new PDFGenerator(),
    private excelGenerator: ExcelGenerator = new ExcelGenerator(),
    private csvGenerator: CSVGenerator = new CSVGenerator(),
    private getTasksUseCase: GetTasksUseCase = new GetTasksUseCase(),
    private getTaskByIdUseCase: GetTaskByIdUseCase = new GetTaskByIdUseCase()
  ) {}
  
  async execute(request: ExportRequest): Promise<ExportResponse> {
    try {
      let tasksData: any[];
      
      // Handle single task export
      if (request.taskIds && request.taskIds.length === 1) {
        const singleTask = await this.getTaskByIdUseCase.execute(request.taskIds[0].toString());
        tasksData = [singleTask];
      } 
      // Handle multiple tasks export
      else if (request.taskIds && request.taskIds.length > 1) {
        const allTasksData = await this.getTasksUseCase.execute(request.filters || {});
        tasksData = allTasksData.tasks?.filter((task: any) => {
          return request.taskIds!.some(id => id == task.id);
        }) || [];
      }
      // Handle all tasks export (no taskIds specified)
      else {
        const allTasksData = await this.getTasksUseCase.execute(request.filters || {});
        tasksData = allTasksData.tasks || allTasksData;
      }
      
      let response: ExportResponse;
      
      switch (request.format) {
        case 'pdf':
          response = await this.pdfGenerator.generate(tasksData, request);
          break;
        case 'excel':
          response = await this.excelGenerator.generate(tasksData, request);
          break;
        case 'csv':
          response = await this.csvGenerator.generate(tasksData, request);
          break;
        default:
          throw new Error(`Unsupported export format: ${request.format}`);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}