import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task } from "@/domain/entities/task.entity.ts";
import { API_URL } from "@/lib/constants.ts";
import { TokenStorage } from "@/InfraStructure/storage/token.storage";

export interface SearchTasksResponse {
  tasks: Task[];
}

const api = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers) => {
        const token = TokenStorage.get(); 
        if (token) {
          headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }

  }),
  endpoints: (builder) => ({
    searchTasks: builder.query<SearchTasksResponse, string>({
      query: (q) => `tasks/search?q=${encodeURIComponent(q)}`,
    }),
  }),
});

export const { useSearchTasksQuery } = api;
export default api;