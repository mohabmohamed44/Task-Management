import { commentsAPI } from "@/InfraStructure/api/comments.api";
import type {CreateCommentRequest, UpdateCommentRequest} from "@/domain/entities/comments.dto"
import type { CreateCommentResponse, GetCommentsResponse, UpdateCommentResponse } from "@/domain/entities/comments.response";
import toast from "react-hot-toast";

export class CreateCommentUseCase {
    async execute(taskId: string, data: CreateCommentRequest): Promise<CreateCommentResponse> {
        try {
            const res = await commentsAPI.create(taskId, data, );
            console.log('Comment created successfully:', res.data);
            toast.success('Comment created successfully');
            return res.data;
        } catch (error) {
            console.error('=== CreateCommentUseCase Error ===');
            console.error('Error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                toast.error('Failed to create comment');
                console.error('Response status:', axiosError.response?.status);
                console.error('Response data:', JSON.stringify(axiosError.response?.data, null, 2));
            }
            throw error;
        }
    }
}

export class GetCommentsUseCase {
    async execute(taskId: string): Promise<GetCommentsResponse> {
        try {
            const res = await commentsAPI.get(taskId);
            console.log('Comments retrieved successfully:', res.data);
            return res.data;
        } catch (error) {
            console.error('=== GetCommentsUseCase Error ===');
            console.error('Error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response status:', axiosError.response?.status);
                console.error('Response data:', axiosError.response?.data);
            }
            throw error;
        }
    }
}

export class UpdateCommentUseCase {
    async execute(taskId: string, subTaskId: string, data: UpdateCommentRequest): Promise<UpdateCommentResponse> {
        try {
            const res = await commentsAPI.update(taskId, subTaskId, data);
            console.log('Comment updated successfully:', res.data);
            toast.success('Comment Updated Successfully')
            return res.data;
        } catch (error) {
            console.error('=== UpdateCommentUseCase Error ===');
            console.error('Error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                toast.error('Failed to update comment');
                console.error('Response status:', axiosError.response?.status);
                console.error('Response data:', axiosError.response?.data);
            }
            throw error;
        }
    }
}

export class DeleteCommentUseCase {
    async execute(taskId: string, subTaskId: string): Promise<void> {
        try {
            await commentsAPI.delete(taskId, subTaskId);
            toast.success('Comment deleted Successfully');
            console.log('Comment deleted successfully');
        } catch (error) {
            console.error('=== DeleteCommentUseCase Error ===');
            console.error('Error:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                toast.error('Failed to delete comment');
                console.error('Response status:', axiosError.response?.status);
                console.error('Response data:', axiosError.response?.data);
            }
            throw error;
        }
    }
}