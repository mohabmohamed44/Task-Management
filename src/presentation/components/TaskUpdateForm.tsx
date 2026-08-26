import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Button } from "@/presentation/components/ui/button";
import type { Task } from "@/domain/entities/task.entity";
import type { UpdateTaskDTO } from "@/domain/entities/task.dto";
import { TaskPriority } from "@/domain/enums/task-priority.enum";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(TaskPriority),
  category: z.string().min(2, "Category is required"),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskUpdateFormProps {
  task: Task;
  onSubmit: (data: UpdateTaskDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return "";
      
      // Format as YYYY-MM-DD for date input
      return dateObj.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

const formatTagsForInput = (tags: string[]): string => {
    return tags.map(tag => {
      if (typeof tag === 'object' && tag !== null) {
        return (tag as any).name || (tag as any).id || JSON.stringify(tag);
      }
      return tag;
    }).join(", ");
  };

export function TaskUpdateForm({ task, onSubmit, onCancel, isLoading = false }: TaskUpdateFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: typeof task.category === 'object' ? (task.category as any).name : task.category,
      dueDate: formatDateForInput(task.dueDate),
      tags: formatTagsForInput(task.tags || []),
    },
  });

  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: typeof task.category === 'object' ? (task.category as any).name : task.category,
      dueDate: formatDateForInput(task.dueDate),
      tags: formatTagsForInput(task.tags || []),
    });
  }, [task, form]);

  const handleSubmit = (values: TaskFormValues) => {
    const updateData: UpdateTaskDTO = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      category: values.category,
      dueDate: values.dueDate || undefined,
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
    };
    onSubmit(updateData);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Update Task</h2>
        <Button variant="outline" onClick={onCancel} disabled={isLoading} aria-label="Cancel" aria-required="true" aria-invalid={isLoading} aria-describedby="cancel-error" aria-pressed={isLoading} name="cancel" id="cancel">
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} aria-label="Title" aria-required="true" aria-invalid={!!field.value} aria-describedby="title-error" aria-pressed={!!field.value} name="title" id="title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter task description" 
                    className="min-h-25"
                    {...field} 
                    aria-label="Description" 
                    aria-required="true" 
                    aria-invalid={!!field.value} 
                    aria-describedby="description-error" 
                    aria-pressed={!!field.value} 
                    name="description" 
                    id="description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    aria-label="Priority"
                    aria-required="true"
                    aria-invalid={!!field.value}
                    aria-describedby="priority-error"
                    aria-pressed={!!field.value}
                    name="priority"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TaskPriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma-separated)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter tags separated by commas" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              aria-label="Cancel"
              aria-required="true"
              aria-invalid={isLoading}
              aria-describedby="cancel-error"
              aria-pressed={isLoading}
              name="cancel"
              id="cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              aria-label="Update task"
              aria-required="true"
              aria-invalid={isLoading}
              aria-describedby="update-task-error"
              aria-pressed={isLoading}
              name="update-task"
              id="update-task"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
