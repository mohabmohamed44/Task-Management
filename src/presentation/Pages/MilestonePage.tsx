import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Milestone, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/presentation/components/Button";
import { format } from "date-fns";
import MetaData from "../components/MetaData";
import { useMilestones } from "@/app/hooks/useMilestones";
import { useAuth } from "@/presentation/hooks/useAuth";
import type { UIMilestone } from "./Milestones/types";
import { formatDateDisplay } from "./WeeklyGoals/utils/dateHelpers";

const MilestonesView = lazy(() => import("./Milestones/components/MilestonesView").then(({ MilestonesView }) => ({ default: MilestonesView })));
const MilestoneReportModal = lazy(() => import("./Milestones/components/MilestoneReportModal").then(({ MilestoneReportModal }) => ({ default: MilestoneReportModal })));
const UpdateStatsModal = lazy(() => import("./Milestones/components/UpdateStatsModal").then(({ UpdateStatsModal }) => ({ default: UpdateStatsModal })));
const CreateMilestoneModal = lazy(() => import("./Milestones/components/CreateMilestoneModal").then(({ CreateMilestoneModal }) => ({ default: CreateMilestoneModal })));

export default function MilestonePage() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [, forceTick] = useState(0);
  const [reportMilestone, setReportMilestone] = useState<UIMilestone | null>(null);
  const [updateTarget, setUpdateTarget] = useState<UIMilestone | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();

  // Re-render periodically so the week range and query keys update across midnight/week rollover.
  useEffect(() => {
    const id = window.setInterval(() => {
      forceTick((t) => t + 1);
    }, 60_000);

    return () => window.clearInterval(id);
  }, []);

  const {
    goals,
    isLoading,
    isError,
    refetch,
    weekDays,
    addMilestone,
    updateMilestone,
    isAdding,
    isUpdating,
  } = useMilestones(currentWeekOffset);

  const goToPreviousWeek = () => setCurrentWeekOffset((prev) => prev - 1);
  const goToNextWeek = () => setCurrentWeekOffset((prev) => prev + 1);
  const goToCurrentWeek = () => setCurrentWeekOffset(0);

  // Adapt the raw goal/milestone data into the rich card model used by the new UI design.
  const milestones: UIMilestone[] = useMemo(() => {
    const list: UIMilestone[] = [];
    const safeGoals = Array.isArray(goals) ? goals : [];

    safeGoals.forEach((goal) => {
      const goalMilestones = Array.isArray(goal?.milestones) ? goal.milestones : [];

      goalMilestones.forEach((m: any) => {
        const completed =
          m?.completed === true || m?.status === "completed" || m?.status === "Completed";
        const dueDate = m?.createdAt ? new Date(m.createdAt) : null;

        list.push({
          id: String(m.id),
          goalId: String(goal.id),
          title: m?.title ?? "Untitled milestone",
          description: "",
          status: completed ? "Achieved" : "In Progress",
          dueDate: dueDate ? format(dueDate, "MMM d, yyyy") : "No date",
          priority: "Medium",
          deliverables: [{ id: `del_${m.id}`, title: m?.title ?? "Untitled milestone", completed }],
          assignedTeam: currentUser
            ? [
                {
                  id: String(currentUser.id),
                  name: currentUser.name,
                  avatar: currentUser.profile_image_url ?? "",
                  role: currentUser.role ?? "Member",
                },
              ]
            : [],
          logs: [],
        });
      });
    });

    return list;
  }, [goals, currentUser]);

  const goalOptions = useMemo(
    () =>
      (Array.isArray(goals) ? goals : []).map((goal) => ({
        id: String(goal.id),
        title: goal.title ?? "Untitled goal",
      })),
    [goals]
  );

  const handleToggleDeliverable = (milestoneId: string) => {
    const target = milestones.find((m) => m.id === milestoneId);
    if (!target) return;
    const deliverable = target.deliverables[0];
    if (!deliverable) return;

    updateMilestone(target.goalId, milestoneId, {
      completed: !deliverable.completed,
    });
  };

  const handleSaveMilestoneUpdate = (
    goalId: string,
    milestoneId: string,
    data: { title: string; completed: boolean }
  ) => {
    updateMilestone(goalId, milestoneId, data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-black dark:border-t-white absolute top-0"></div>
          </div>
          <p className="font-inter font-medium text-gray-500 dark:text-gray-400">Loading Milestones...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto dark:bg-gray-800">
            <AlertCircle className="h-16 w-16 text-gray-900 dark:text-gray-100" />
          </div>
          <h3 className="font-montserrat text-xl font-semibold text-gray-900 dark:text-gray-100">Error loading milestones</h3>
          <p className="font-inter text-gray-500 dark:text-gray-400">Unable to load milestone data. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()}
            name="retry"
            id="retry"
            aria-label="Retry"
            aria-required="true"
            aria-invalid={false}
            aria-describedby="retry-error"
            aria-pressed={false}
          >
            <RefreshCcw className="h-5 w-5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title="Milestones"
        description="Track milestones across your weekly goals"
        path="/milestones"
        image="/milestones-og.png"
        type="website"
        noIndex={false}
      />
      <div
        className="min-h-screen p-4 md:p-6 lg:p-8 selection:text-white selection:bg-gray-900 dark:selection:bg-white dark:selection:text-gray-900"
        role="main"
        aria-label="Milestones Page"
      >
        <div className="max-w-7xl mx-auto">
          {/* Week Navigation Header */}
          <Header
            weekDays={weekDays}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
            onCurrentWeek={goToCurrentWeek}
          />

          {/* Milestones View (card design) */}
          <Suspense fallback={<div className="min-h-96" role="status" aria-label="Loading milestones" />}>
            <MilestonesView
              milestones={milestones}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onToggleDeliverable={handleToggleDeliverable}
              onViewReport={setReportMilestone}
              onUpdateStats={setUpdateTarget}
              onCreateMilestoneClick={() => setIsCreateOpen(true)}
            />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={null}>
        {reportMilestone && (
          <MilestoneReportModal milestone={reportMilestone} onClose={() => setReportMilestone(null)} />
        )}
        {updateTarget && (
          <UpdateStatsModal
            open={!!updateTarget}
            onOpenChange={(open) => {
              if (!open) setUpdateTarget(null);
            }}
            milestone={updateTarget}
            onSubmit={handleSaveMilestoneUpdate}
            isPending={isUpdating}
          />
        )}
        {isCreateOpen && (
          <CreateMilestoneModal
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            goals={goalOptions}
            onSubmit={(goalId, title) => addMilestone(goalId, { title })}
            isPending={isAdding}
          />
        )}
      </Suspense>
    </>
  );
}

// Sub-components

interface HeaderProps {
  weekDays: { day: string; date: Date }[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

function Header({ weekDays, onPreviousWeek, onNextWeek, onCurrentWeek }: HeaderProps) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex items-center justify-center h-12 w-12 shrink-0 rounded border border-gray-200 dark:border-gray-800" aria-hidden="true">
            <Milestone className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
              Weekly Tracking
            </p>
            <h1 className="mt-2 font-montserrat text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Milestones
            </h1>
            <p className="mt-2 max-w-xl font-inter text-base text-gray-500 dark:text-gray-400">
              Break each goal into measurable milestones and track them week by week.
            </p>
          </div>
        </div>

        <WeekNavigation onPrevious={onPreviousWeek} onNext={onNextWeek} onCurrent={onCurrentWeek} />
      </div>

      <div className="mt-6 flex items-center gap-2 font-inter text-sm font-medium text-gray-500 dark:text-gray-400" aria-live="polite">
        <Calendar className="h-4 w-4" />
        <span>
          {formatDateDisplay(weekDays[0]?.date)} - {formatDateDisplay(weekDays[6]?.date)},{" "}
          {format(weekDays[0]?.date, "yyyy")}
        </span>
      </div>
    </header>
  );
}

interface WeekNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onCurrent: () => void;
}

function WeekNavigation({ onPrevious, onNext, onCurrent }: WeekNavigationProps) {
  return (
    <div
      className="flex flex-row items-stretch gap-2 rounded border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900"
      role="navigation"
      aria-label="Week navigation"
    >
      <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="Go to previous week" className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={onCurrent}
        aria-label="Go to current week"
        aria-required="true"
        aria-invalid={false}
        aria-describedby="go-to-current-week-error"
        aria-pressed={false}
        name="go-to-current-week"
        id="go-to-current-week"
        className="font-montserrat px-3 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        This Week
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext} aria-label="Go to next week" aria-required="true" aria-invalid={false} aria-describedby="go-to-next-week-error" aria-pressed={false} name="go-to-next-week" id="go-to-next-week" className="h-9 w-9">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
