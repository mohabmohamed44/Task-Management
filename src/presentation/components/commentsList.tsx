import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/presentation/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Send, X } from "lucide-react";
import { useCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from "@/app/Queries/comments.query";
import { formatDate } from "@/domain/utils/date";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
interface CommentsListProps {
    taskId: string;
}

export default function CommentsList({ taskId }: CommentsListProps) {
    const [newCommentText, setNewCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const { data: currentUser } = useCurrentUserQuery();
    const { data: comments, isLoading } = useCommentsQuery({ task_id: Number(taskId) });
    const createCommentMutation = useCreateCommentMutation();
    const updateCommentMutation = useUpdateCommentMutation();
    const deleteCommentMutation = useDeleteCommentMutation();

    const userImage = currentUser?.profile_image_url || (currentUser as any)?.profilePicture;

    const handleCreateComment = () => {
        if (!newCommentText.trim()) return;
        createCommentMutation.mutate(
            { taskId, data: { text: newCommentText } },
            {
                onSuccess: () => {
                    setNewCommentText("");
                },
            }
        );
    };

    const handleUpdateComment = (commentId: number) => {
        if (!editingText.trim()) return;
        updateCommentMutation.mutate(
            { taskId, subTaskId: commentId.toString(), data: { text: editingText } },
            {
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditingText("");
                },
            }
        );
    };

    const handleDeleteComment = (commentId: number) => {
        // if (confirm("Are you sure you want to delete this comment?")) {
            deleteCommentMutation.mutate({ taskId, subTaskId: commentId.toString() });
        //}
    };

    const startEditing = (commentId: number, currentText: string) => {
        setEditingCommentId(commentId);
        setEditingText(currentText);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        Comments
                        <Badge variant="secondary" className="ml-2">
                            {comments?.length || 0}
                        </Badge>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 sm:gap-4 overflow-hidden px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground py-4">Loading comments...</div>
                    ) : comments && comments.length > 0 ? (
                        comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-2 sm:gap-3 group">
                                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
                                    <AvatarImage src={userImage} />
                                    <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || "ME"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                            <span className="text-xs sm:text-sm font-semibold">{comment.userName}</span>
                                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                                                {comment.created_at ? formatDate(new Date(comment.created_at)) : ""}
                                            </span>
                                        </div>
                                        {/* Actions for current user's comments could go here if we had user ID check */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => startEditing(comment.id, comment.text)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteComment(comment.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {editingCommentId === comment.id ? (
                                        <div className="space-y-2">
                                            <Textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="min-h-15"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={cancelEditing}>
                                                    <X className="h-4 w-4 mr-1" /> Cancel
                                                </Button>
                                                <Button size="sm" onClick={() => handleUpdateComment(comment.id)} disabled={updateCommentMutation.isPending}>
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>

                <div className="pt-3 sm:pt-4 border-t mt-auto">
                    <div className="flex gap-2 sm:gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={userImage} />
                            <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || "ME"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="Write a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                className="min-h-[60px] sm:min-h-20 resize-none text-xs sm:text-sm"
                            />
                            <div className="flex justify-end">
                                <Button 
                                    size="sm" 
                                    onClick={handleCreateComment} 
                                    disabled={!newCommentText.trim() || createCommentMutation.isPending}
                                    className="text-xs sm:text-sm"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
