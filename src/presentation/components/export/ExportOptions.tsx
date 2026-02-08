import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Label } from "@/presentation/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";

interface ExportOptionsProps {
  selectedFormat: 'pdf' | 'excel' | 'csv';
  onFormatChange: (format: 'pdf' | 'excel' | 'csv') => void;
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

const availableColumns = [
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description' },
  { id: 'priority', label: 'Priority' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
];

export const ExportOptions = ({ 
  selectedFormat, 
  onFormatChange, 
  selectedColumns, 
  onColumnsChange 
}: ExportOptionsProps) => {
  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      onColumnsChange([...selectedColumns, columnId]);
    } else {
      onColumnsChange(selectedColumns.filter(col => col !== columnId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onColumnsChange(availableColumns.map(col => col.id));
    } else {
      onColumnsChange([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Export Format</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFormat} onValueChange={onFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Column Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Columns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedColumns.length === availableColumns.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all">Select All</Label>
          </div>

          {/* Individual Columns */}
          <div className="grid grid-cols-2 gap-3">
            {availableColumns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={(checked) => handleColumnToggle(column.id, checked as boolean)}
                />
                <Label htmlFor={column.id} className="text-sm">
                  {column.label}
                </Label>
              </div>
            ))}
          </div>

          {selectedColumns.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Please select at least one column to export.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};