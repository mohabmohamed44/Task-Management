import { useState } from "react";
import {
    useAttachmentsQuery,
    useUploadAttachmentMutation,
    useDeleteAttachmentMutation,
    useDownloadAttachmentMutation,
} from "@/app/Queries/attachment.queries";
import type { CreateAttachmentDto } from "@/domain/entities/attachment.dto";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Badge } from "@/presentation/components/ui/badge";
import { Label } from "@/presentation/components/ui/label";
import { Trash2, Download, Upload, SendHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

interface AttachmentsProps {
    taskId: string;
}

export function Attachments({ taskId }: AttachmentsProps) {
    const { data: attachments, isLoading } = useAttachmentsQuery(taskId);
    const uploadMutation = useUploadAttachmentMutation();
    const deleteMutation = useDeleteAttachmentMutation();
    const downloadMutation = useDownloadAttachmentMutation();

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            const dto: CreateAttachmentDto = {
                taskId,
                file,
                fileName: file.name,
                mimeType: file.type,
            };
            await uploadMutation.mutateAsync(dto);
            toast.success("Attachment uploaded successfully");
            setFile(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload attachment");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (taskId: string, id: string) => {
        if (!confirm("Are you sure you want to delete this attachment?"))
            return;
        try {
            await deleteMutation.mutateAsync({ taskId, id });
            toast.success("Attachment deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete attachment");
        }
    };

    const handleDownload = async (
        taskId: string,
        attachmentId: string,
        fileName: string,
    ) => {
        try {
            const blob = await downloadMutation.mutateAsync({
                taskId,
                attachmentId,
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Attachment downloaded");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download attachment");
        }
    };

    if (isLoading) return <div>Loading attachments...</div>;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                        Attachments
                    </CardTitle>
                    <Badge variant={"secondary"} className="ml-2">
                        {attachments?.length || 0}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload Form */}
                <form onSubmit={handleUpload} className="space-y-2">
                    <Label htmlFor="file">Upload File</Label>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary border-muted-foreground/25 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground/60">
                                    PNG, JPG, JPEG or PDF
                                </p>
                            </div>
                            <Input
                                id="file"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                                accept="image/png,image/jpeg,image/jpg,application/pdf"
                            />
                        </label>
                    </div>
                    {file && (
                        <p className="text-xs text-green-600 font-medium italic">
                            Selected: {file.name}
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button type="submit" disabled={!file || uploading} className="flex justify-end gap-2">
                        {uploading ? "Uploading..." : "Upload"}
                        <SendHorizontal size={24} />
                      </Button>
                    </div>
                </form>

                {/* Attachments List */}
                <div className="space-y-2">
                    {attachments && attachments.length > 0 ? (
                        attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center justify-between p-2 border rounded"
                            >
                                <div className="flex items-center space-x-2">
                                    {attachment.mimeType?.startsWith(
                                        "image/",
                                    ) ? (
                                        <img
                                            src={attachment.url}
                                            alt={attachment.fileName}
                                            className="w-10 h-10 object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                                            PDF
                                        </div>
                                    )}
                                    <span>{attachment.fileName}</span>
                                    <span className="text-sm text-gray-500">
                                        ({attachment.size} bytes)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDownload(
                                                taskId,
                                                attachment.id,
                                                attachment.fileName,
                                            )
                                        }
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(taskId, attachment.id)
                                        }
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                      <p className="text-center text-muted-foreground py-3 border-2 border-dashed border-muted rounded-lg">
                        No attachments yet.
                      </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
