import {
  Target,
  Plus,
  MoreHorizontal,
  Calendar,
  Flag,
  Tag,
  GripVertical,
  CheckCircle,
  Circle,
  Search,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Input } from "@/presentation/components/ui/input";
import MetaData from "../components/MetaData";

// Kanban column interface
interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskCount: number;
}

// Sample columns
const COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do", color: "bg-gray-500", taskCount: 4 },
  { id: "in-progress", title: "In Progress", color: "bg-gray-600", taskCount: 2 },
  { id: "review", title: "In Review", color: "bg-gray-700", taskCount: 1 },
  { id: "done", title: "Done", color: "bg-gray-800", taskCount: 5 },
];

// Sample tasks for display
const SAMPLE_TASKS = {
  todo: [
    { id: 1, title: "Design new landing page mockups", priority: "high", category: "Design", dueDate: "Mar 10", tags: ["UI/UX"], completed: false },
    { id: 2, title: "Set up CI/CD pipeline", priority: "medium", category: "Development", dueDate: "Mar 12", tags: ["DevOps"], completed: false },
    { id: 3, title: "Write API documentation", priority: "low", category: "Documentation", dueDate: "Mar 15", tags: ["Docs"], completed: false },
    { id: 4, title: "Review competitor analysis", priority: "medium", category: "Research", dueDate: "Mar 14", tags: ["Research"], completed: false },
  ],
  "in-progress": [
    { id: 5, title: "Implement user authentication", priority: "high", category: "Development", dueDate: "Mar 9", tags: ["Backend"], completed: false },
    { id: 6, title: "Create dashboard components", priority: "medium", category: "Development", dueDate: "Mar 11", tags: ["Frontend"], completed: false },
  ],
  review: [
    { id: 7, title: "Fix navigation bug on mobile", priority: "high", category: "Bug", dueDate: "Mar 8", tags: ["Bug"], completed: false },
  ],
  done: [
    { id: 8, title: "Set up project repository", priority: "high", category: "Setup", dueDate: "Mar 1", tags: ["DevOps"], completed: true },
    { id: 9, title: "Create design system tokens", priority: "medium", category: "Design", dueDate: "Mar 3", tags: ["UI/UX"], completed: true },
    { id: 10, title: "Write unit tests for auth module", priority: "medium", category: "Testing", dueDate: "Mar 5", tags: ["Tests"], completed: true },
    { id: 11, title: "Configure environment variables", priority: "low", category: "Setup", dueDate: "Mar 2", tags: ["DevOps"], completed: true },
    { id: 12, title: "Update README documentation", priority: "low", category: "Documentation", dueDate: "Mar 4", tags: ["Docs"], completed: true },
  ],
};

// Priority badge colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900";
    case "medium":
      return "bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900";
    case "low":
      return "bg-gray-400 dark:bg-gray-600 text-white dark:text-gray-100";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function Kanban() {
  // Calculate total tasks
  const totalTasks = Object.values(SAMPLE_TASKS).flat().length;
  const completedTasks = Object.values(SAMPLE_TASKS)
    .flat()
    .filter((task) => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <MetaData
        title="Kanban"
        description="Track your Essential Goals in dynamic Kanban Boards"
        path="/kanban"
        type="website"
      />
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 selection:text-white selection:bg-gray-900"
      role="main"
      aria-label="Kanban Board Page"
    >
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm"
                aria-hidden="true"
              >
                <LayoutGrid className="h-7 w-7 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Kanban Board
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                  Organize tasks with drag-and-drop columns
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                aria-label="Toggle view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                aria-label="Filter tasks"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
                aria-label="Add new task"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{totalTasks}</span> total tasks
            </div>
            <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{completedTasks}</span> completed
            </div>
            <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Progress
                value={completionRate}
                className="w-20 h-2 bg-gray-200 dark:bg-gray-700"
                aria-label={`Completion rate: ${completionRate}%`}
              />
              <span className="font-medium">{completionRate}%</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                aria-label="Search tasks"
              />
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <div
          className="overflow-x-auto pb-4"
          role="region"
          aria-label="Kanban board columns"
        >
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((column) => (
              <div
                key={column.id}
                className="w-80 shrink-0"
                role="list"
                aria-label={`${column.title} column`}
              >
                {/* Column Header */}
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-800/50">
                  <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${column.color}`}
                          aria-hidden="true"
                        />
                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {column.title}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          aria-label={`${column.taskCount} tasks`}
                        >
                          {column.taskCount}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tasks Container */}
                <div
                  className="space-y-3 mt-3 min-h-50"
                  role="list"
                  aria-label={`Tasks in ${column.title}`}
                >
                  {SAMPLE_TASKS[column.id as keyof typeof SAMPLE_TASKS]?.map((task) => (
                    <Card
                      key={task.id}
                      className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                      role="listitem"
                      aria-label={`Task: ${task.title}`}
                    >
                      <CardContent className="p-4">
                        {/* Task Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </Button>
                            <span
                              className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${
                                task.completed ? "line-through text-gray-500 dark:text-gray-500" : ""
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Drag task"
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Task Meta */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {/* Priority Badge */}
                          <Badge
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                            aria-label={`Priority: ${task.priority}`}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>

                          {/* Category */}
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                            aria-label={`Category: ${task.category}`}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {task.category}
                          </Badge>

                          {/* Due Date */}
                          <div
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500"
                            aria-label={`Due date: ${task.dueDate}`}
                          >
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </div>
                        </div>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Task Button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700"
                    aria-label="Add task to this column"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </div>
              </div>
            ))}

            {/* Add Column Button */}
            <div className="w-80 shrink-0">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 h-14"
                aria-label="Add new column"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        </div>

        {/* Empty State (for reference) */}
        <Card className="mt-8 border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="py-12 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Target className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Start by creating your first task and organize it into columns.
            </p>
            <Button className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900">
              Create Your First Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
