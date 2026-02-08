import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { ExportOptions } from "./ExportOptions";
import { ExportButton } from "./ExportButton";
import { useExport } from "@/app/hooks/useExport";
import type { ExportRequest } from "@/domain/entities/export.dto";
import toast from "react-hot-toast";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskIds?: number[];
  filters?: any;
}

export const ExportModal = ({ isOpen, onClose, taskIds, filters }: ExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['title', 'description', 'priority', 'category', 'status']);
  
  const { exportTasks, isLoading } = useExport();

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export");
      return;
    }

    try {
      const exportRequest: ExportRequest = {
        format: selectedFormat,
        taskIds,
        filters,
        columns: selectedColumns,
      };

      const response = await exportTasks(exportRequest);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = response.url;
      link.download = response.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(response.url);
      
      toast.success(`Tasks exported successfully as ${selectedFormat.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Tasks</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <ExportOptions
            selectedFormat={selectedFormat}
            onFormatChange={setSelectedFormat}
            selectedColumns={selectedColumns}
            onColumnsChange={setSelectedColumns}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <ExportButton
              onClick={handleExport}
              isLoading={isLoading}
              disabled={selectedColumns.length === 0}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};