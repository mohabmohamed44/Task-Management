import { useMutation } from "@tanstack/react-query";
import { ExportTasksUseCase } from "@/domain/usecases/export/exportTasks.usecase.ts";
import type { ExportRequest } from "@/domain/entities/export.dto.ts";

const exportTasksUseCase = new ExportTasksUseCase();

export const useExportMutation = () => {
  return useMutation({
    mutationFn: (request: ExportRequest) => exportTasksUseCase.execute(request),
  });
};