import { useState, useRef, useEffect } from "react";
import { Input } from "@/presentation/components/ui/input";
import { Search, Calendar, Tag } from "lucide-react";
import { useSearchTasksQuery } from "@/app/redux/slices/search.slice";
import { useNavigate } from "react-router";
import type { Task } from "@/domain/entities/task.entity";
import { formatDate } from "@/domain/utils/date";
import { useDebounce } from "../hooks/useDebounce";
import { getPriorityColor } from "@/domain/utils/task-ui";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";
export default function SearchInput() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTaskClick = (taskId: number) => {
        navigate(`/tasks/${taskId}`);
        setIsOpen(false);
        setQuery("");
    };

    return (
        <div
            className="hidden md:flex flex-1 justify-center px-2"
            ref={searchRef}
        >
            <div className="w-full max-w-lg relative">
                <div className="relative">
                    <Input
                        placeholder="Search tasks..."
                        type="text"
                        value={query}
                        onChange={(e) => {
                            const sanitized = sanitizeValues({ query: e.target.value });
                            setQuery(sanitized.query);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="pl-10 pr-4"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                        </div>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {isOpen && query.length >= 2 && (
                    <div className="absolute top-full mt-2 w-full dark:bg-black dark:text-white bg-white border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                        {tasks.length === 0 && !isLoading ? (
                            <div className="p-4 text-center text-gray-500">
                                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p>No tasks found</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {tasks.map((task: Task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-blue-500 cursor-pointer border-b border-gray-100 dark:border-0 last:border-b-0 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium dark:text-white text-gray-900 truncate">
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 mt-2">
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
                                                        <div className="flex items-center gap-1 mt-2">
                                                            {task.tags
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                                                                        >
                                                                            #
                                                                            {
                                                                                tag
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            {task.tags &&
                                                                task.tags
                                                                    .length >
                                                                    3 && (
                                                                    <span className="text-xs text-gray-500">
                                                                        +
                                                                        {task
                                                                            .tags
                                                                            .length -
                                                                            3}
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
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
