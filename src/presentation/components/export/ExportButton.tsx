import { Download } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

interface ExportButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ExportButton = ({ onClick, isLoading = false, disabled = false }: ExportButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isLoading ? "Exporting..." : "Export"}
    </Button>
  );
};