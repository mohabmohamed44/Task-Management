import { useMutation } from "@tanstack/react-query";
import type { ExportRequest, ExportResponse } from "@/domain/entities/export.dto";
import { ExportTasksUseCase } from "@/domain/usecases/export/exportTasks.usecase";

const exportTasksUseCase = new ExportTasksUseCase();


export const useExportMutation = () => {
    return useMutation<ExportResponse, Error, ExportRequest>({
        mutationFn: (request: ExportRequest) => exportTasksUseCase.execute(request),
        onSuccess: (response) => {
            console.log('Export Successful', response);
        },
        onError: (error) => {
            console.error('Export Failed', error);
        }
    })
}
