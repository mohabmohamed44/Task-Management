import type { ExportRequest } from "@/domain/entities/export.dto";
import { useCallback } from "react";
import { useExportMutation } from "@/app/Queries/export.query";
export const useExport = () => {
  const exportMutation = useExportMutation();
  
  const exportTasks = useCallback((request: ExportRequest) => {
    return exportMutation.mutateAsync(request);
  }, [exportMutation]);
  
  return { exportTasks, isLoading: exportMutation.isPending };
};