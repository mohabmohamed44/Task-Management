import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/presentation/components/ui/form";
import toast from "react-hot-toast";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Button } from "@/presentation/components/Button";
import { useCreateTaskMutation } from "@/app/Queries/task.query";
import type { CreateTaskDTO } from "@/domain/entities/task.dto";
import { TaskPriority } from "@/domain/enums/task-priority.enum";
import { useNavigate } from "react-router";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";
import { sanitizeUserInput } from "@/lib/sanitization";
import MetaData from "../components/MetaData";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(TaskPriority),
  category: z.string().min(2, "Category is required"),
  // Backend allows optional dueDate
  dueDate: z.string().optional(),
  // Comma-separated string in the UI, transformed to string[] on submit
  tags: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function CreateTask() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateTaskMutation();
  
  // Initialize sanitization hook for task form fields
  const { sanitizeValues } = useSanitizedForm<{
    title: string;
    description: string;
    category: string;
    tags: string;
  }>({
    title: 'task-title',
    description: 'task-description',
    category: 'text',
    tags: 'text'
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.Low,
      category: "",
      dueDate: "",
      tags: "",
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    // Split tags first before sanitization to preserve commas
    const rawTags = values.tags || "";
    const tagsArray = rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    // Sanitize form values before creating task
    const sanitized = sanitizeValues({
      title: values.title,
      description: values.description,
      category: values.category,
      tags: values.tags || ""
    });

    // Sanitize individual tags
    const sanitizedTags = tagsArray.map(tag => sanitizeUserInput(tag, 'text'));

    const payload: CreateTaskDTO = {
      title: sanitized.title,
      description: sanitized.description,
      priority: values.priority as TaskPriority,
      category: sanitized.category,
      dueDate: values.dueDate || undefined,
      tags: sanitizedTags,
    };

    try {
      await mutateAsync(payload);
      toast.success("Task Added Successfully !");
      navigate("/tasks");
    } catch (error: unknown) {
      let errorMessage = "Failed to create task. Please try again.";
      
      if (error && typeof error === 'object') {
        const errorObj = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
        errorMessage = 
          errorObj.response?.data?.message ??
          errorObj.response?.data?.error ??
          errorObj.message ??
          errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error("Failed to create task. Please try again.");
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <>
    <MetaData 
      title="Create Task"
      description="Create your first new task"
      path="/create-task"
      noIndex={false}
      type="website"
    />
    <div className="flex flex-col items-center justify-center min-h-screen p-4 selection:text-white selection:bg-black dark:selection:bg-gray-700 dark:selection:text-gray-300">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="md:text-3xl text-xl font-semibold">Create A Task</h1>
          <p className="text-muted-foreground text-md md:text-xl text-center mt-2">
            Enter your task details below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main title of your task.
                  </FormDescription>
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
                      rows={4}
                      placeholder="Describe what needs to be done"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide enough detail for implementation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(TaskPriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority.charAt(0).toUpperCase() +
                                priority.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      How important this task is.
                    </FormDescription>
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
                      <Input placeholder="e.g. development" {...field} />
                    </FormControl>
                    <FormDescription>
                      Group similar tasks by category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When this task should be completed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comma-separated tags (e.g. api, backend, documentation)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional tags to help with filtering.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full md:w-auto"
                loading={isPending}
                disabled={isPending}
              >
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
    </>
  );
}
