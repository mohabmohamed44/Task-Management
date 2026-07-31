import { ArrowRight, Milestone } from "lucide-react";
import type { UIMilestone } from "../types";

interface FeaturedOverviewProps {
  milestone: UIMilestone | null;
  onLearnMore: () => void;
}

export function FeaturedOverview({ milestone, onLearnMore }: FeaturedOverviewProps) {
  if (!milestone) return null;

  const completedCount = milestone.deliverables.filter((d) => d.completed).length;
  const totalCount = milestone.deliverables.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section
      aria-label="Featured milestone overview"
      className="relative mb-8 overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="h-1 w-full bg-gray-900 dark:bg-white" aria-hidden="true" />

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 p-6 md:p-8">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
          <Milestone className="h-6 w-6 text-gray-900 dark:text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
            Featured Milestone
          </p>
          <h2 className="mt-1 font-montserrat text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
            {milestone.title}
          </h2>
          <p className="mt-1 max-w-2xl font-inter text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
            {milestone.description || "Track this milestone's deliverables and progress towards completion."}
          </p>
        </div>

        <div className="w-full md:w-56 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest font-montserrat text-gray-400">
              {progressPercent}% complete
            </span>
            <span className="text-[10px] font-black font-inter text-gray-900 dark:text-white">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
            <div
              className="h-full bg-gray-900 transition-all duration-500 dark:bg-white"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={onLearnMore}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white font-montserrat text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Open Report
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
