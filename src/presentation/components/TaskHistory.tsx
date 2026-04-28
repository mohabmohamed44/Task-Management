import { useState } from 'react';
import { ChevronDown, ChevronUp, History, User } from 'lucide-react';
import type { getTaskHistory } from "@/domain/entities/task.entity";
import { formatDate } from "@/domain/utils/date";

interface TaskHistoryItemProps {
  history: getTaskHistory;
}

const TaskHistoryItem = ({ history }: TaskHistoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Created';
      case 'updated':
        return 'Updated';
      case 'deleted':
        return 'Deleted';
      case 'completed':
        return 'Completed';
      default:
        return action.charAt(0).toUpperCase() + action.slice(1);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600 bg-green-100';
      case 'updated':
        return 'text-blue-600 bg-blue-100';
      case 'deleted':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full border-t border-border py-3">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${getActionColor(history.action)}`}>
            {getActionLabel(history.action)}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDate(history.created_at)}
          </span>
        </div>
        <button className="p-1 hover:bg-secondary rounded-full transition-colors">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{history.userName || history.users?.name || 'Unknown User'}</span>
            <span className="text-xs">({history.userEmail || history.users?.email || 'N/A'})</span>
          </div>
          
          {history.field && (
            <div className="text-sm">
              <span className="font-medium">Field:</span>{' '}
              <span className="text-muted-foreground">{history.field}</span>
            </div>
          )}
          
          {history.old_value !== null && (
            <div className="text-sm">
              <span className="font-medium text-destructive">Old:</span>{' '}
              <span className="text-muted-foreground line-through">{history.old_value}</span>
            </div>
          )}
          
          {history.new_value !== null && (
            <div className="text-sm">
              <span className="font-medium text-green-600">New:</span>{' '}
              <span className="text-muted-foreground">{history.new_value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface TaskHistoryProps {
  history: getTaskHistory[];
  isLoading?: boolean;
}

export const TaskHistory = ({ history, isLoading = false }: TaskHistoryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <History className="h-4 w-4 sm:h-5 sm:w-5" />
          Task History
        </h3>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <History className="h-4 w-4 sm:h-5 sm:w-5" />
          Task History
        </h3>
        <p className="text-sm text-muted-foreground">No history available for this task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
        <History className="h-4 w-4 sm:h-5 sm:w-5" />
        Task History
        <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {history.length} entries
        </span>
      </h3>
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border p-3 sm:p-4">
        {history.map((item) => (
          <TaskHistoryItem key={item.id} history={item} />
        ))}
      </div>
    </div>
  );
};

export default TaskHistory;
