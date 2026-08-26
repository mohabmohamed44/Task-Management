import type { RouteObject } from "react-router";
import MainLayout from "@/presentation/Layout/MainLayout";
import {
  CreateTask,
  EditProfilePage,
  HomePage,
  Kanban,
  MilestonePage,
  ProfilePage,
  StatisticsPage,
  TaskDetails,
  TaskPage,
  WeeklyGoals,
} from "@/app/routes/LazyPages";

export const mainRoutes: RouteObject = {
  path: "/",
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: "tasks", element: <TaskPage /> },
    { path: "tasks/:id", element: <TaskDetails /> },
    { path: "statistics", element: <StatisticsPage /> },
    { path: "profile", element: <ProfilePage /> },
    { path: "profile/edit", element: <EditProfilePage /> },
    { path: "create-task", element: <CreateTask /> },
    { path: "kanban", element: <Kanban />},
    { path: "goals", element: <WeeklyGoals />},
    { path: "milestones", element: <MilestonePage />}
  ],
};