import { useState, useEffect } from "react";
import { Search, Calendar, Tag } from "lucide-react";
import { useSearchTasksQuery } from "@/app/redux/slices/search.slice";
import { useNavigate } from "react-router";
import type { Task } from "@/domain/entities/task.entity";
import { formatDate } from "@/domain/utils/date";
import { useDebounce } from "../hooks/useDebounce";
import { getPriorityColor } from "@/domain/utils/task-ui";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";
import { Button } from "@/presentation/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/presentation/components/ui/command";

export default function SearchInput() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    
    // Initialize sanitization hook for search input
    const { sanitizeValues } = useSanitizedForm<{ query: string }>({
        query: 'search'
    });

    const debouncedQuery = useDebounce(query, 500);

    // Only search when query has at least 2 characters
    const { data, isLoading } = useSearchTasksQuery(debouncedQuery, {
        skip: debouncedQuery.length < 2,
    });

    const tasks = data?.tasks || [];

    // Keyboard shortcut handler
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleTaskClick = (taskId: number) => {
        navigate(`/tasks/${taskId}`);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="flex flex-1 justify-center px-0 md:px-2">
            <div className="w-full max-w-2xl relative">
                <Button
                    variant="outline"
                    className="relative h-10 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none pr-12"
                    onClick={() => setOpen(true)}
                >
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <span>Search tasks...</span>
                    <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.35rem] hidden h-7 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput
                        placeholder="Search tasks..."
                        value={query}
                        onValueChange={(val) => {
                            const sanitized = sanitizeValues({ query: val });
                            setQuery(sanitized.query);
                        }}
                    />
                    <CommandList className="max-h-96">
                        <CommandEmpty>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                                </div>
                            ) : (
                                "No tasks found."
                            )}
                        </CommandEmpty>

                        {!isLoading && tasks.length > 0 && (
                            <CommandGroup heading="Tasks">
                                {tasks.map((task: Task) => (
                                    <CommandItem
                                        key={task.id}
                                        value={`${task.title} ${task.description || ''}`}
                                        onSelect={() => handleTaskClick(task.id)}
                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                                    >
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium dark:text-gray-100 text-gray-900 truncate">
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    {task.category && (
                                                        <span className="inline-flex items-center text-xs text-gray-500">
                                                            <Tag className="h-3 w-3 mr-1" />
                                                            {task.category}
                                                        </span>
                                                    )}
                                                    {task.dueDate && (
                                                        <span className="inline-flex items-center text-xs text-gray-500">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {formatDate(
                                                                task.dueDate
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                {task.tags &&
                                                    task.tags.length > 0 && (
                                                        <div className="flex flex-wrap items-center gap-1 mt-2">
                                                            {task.tags
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={index}
                                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                                                        >
                                                                            #{tag}
                                                                        </span>
                                                                    )
                                                                )}
                                                            {task.tags.length > 3 && (
                                                                <span className="text-xs text-gray-500">
                                                                    +{task.tags.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="ml-2 flex items-center">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        task.completed
                                                            ? "bg-green-500"
                                                            : "bg-gray-300 dark:bg-gray-600"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </CommandDialog>
            </div>
        </div>
    );
}
