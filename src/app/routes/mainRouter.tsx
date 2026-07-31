import type { RouteObject } from "react-router";
import MainLayout from "@/presentation/Layout/MainLayout";
import HomePage from "@/presentation/Pages/HomePage";
import TaskPage from "@/presentation/Pages/TaskPage";
import ProfilePage from "@/presentation/Pages/ProfilePage";
import EditProfilePage from "@/presentation/Pages/EditProfilePage";
import StatisticsPage from "@/presentation/Pages/StatisticsPage";
import CreateTask from "@/presentation/Pages/CreateTask";
import TaskDetails from "@/presentation/Pages/TaskDetails";
import Kanban from "@/presentation/Pages/Kanban";
import WeeklyGoals from "@/presentation/Pages/WeeklyGoals";
import MilestonePage from "@/presentation/Pages/MilestonePage";

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