import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAttachmentDto } from "@/domain/entities/attachment.dto";
import { attachmentAPI } from "@/InfraStructure/api/Attachment.api";

export const useAttachmentsQuery = (taskId: string) =>
  useQuery({
    queryKey: ["attachments", taskId],
    queryFn: async () => {
      const res = await attachmentAPI.get(taskId);
      return res.data;
    },
    enabled: !!taskId,
  });

export const useUploadAttachmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateAttachmentDto) => {
      const res = await attachmentAPI.create(dto.taskId, dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};

export const useDeleteAttachmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, id }: { taskId: string; id: string }) => {
      await attachmentAPI.delete(taskId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};

export const useDownloadAttachmentMutation = () => {
  return useMutation({
    mutationFn: async ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) => {
      const res = await attachmentAPI.download(taskId, attachmentId);
      return res.data;
    },
  });
};