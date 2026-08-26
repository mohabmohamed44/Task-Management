import { lazy } from "react";

export const HomePage = lazy(() => import("@/presentation/Pages/HomePage"));
export const TaskPage = lazy(() => import("@/presentation/Pages/TaskPage"));
export const TaskDetails = lazy(() => import("@/presentation/Pages/TaskDetails"));
export const StatisticsPage = lazy(() => import("@/presentation/Pages/StatisticsPage"));
export const ProfilePage = lazy(() => import("@/presentation/Pages/ProfilePage"));
export const EditProfilePage = lazy(() => import("@/presentation/Pages/EditProfilePage"));
export const CreateTask = lazy(() => import("@/presentation/Pages/CreateTask"));
export const Kanban = lazy(() => import("@/presentation/Pages/Kanban"));
export const WeeklyGoals = lazy(() => import("@/presentation/Pages/WeeklyGoals"));
export const MilestonePage = lazy(() => import("@/presentation/Pages/MilestonePage"));
export const LoginPage = lazy(() => import("@/presentation/Pages/LoginPage"));
export const RegisterPage = lazy(() => import("@/presentation/Pages/RegisterPage"));
export const AuthCallback = lazy(() => import("@/presentation/Pages/AuthCallback"));
export const NotFoundPage = lazy(() => import("@/presentation/Pages/NotFoundPage"));
