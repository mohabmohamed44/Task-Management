import { useState } from "react";
import { Flag, Plus, Search } from "lucide-react";
import type { MilestoneStatus, UIMilestone } from "../types";
import { MilestoneCard } from "./MilestoneCard";
import { FeaturedOverview } from "./FeaturedOverview";

interface MilestonesViewProps {
  milestones: UIMilestone[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleDeliverable: (milestoneId: string, deliverableId: string) => void;
  onViewReport: (milestone: UIMilestone) => void;
  onUpdateStats: (milestone: UIMilestone) => void;
  onCreateMilestoneClick: () => void;
}

const STATUS_TABS: ("All" | MilestoneStatus)[] = ["All", "Achieved", "In Progress", "Planned"];

export function MilestonesView({
  milestones,
  searchQuery,
  onSearchChange,
  onToggleDeliverable,
  onViewReport,
  onUpdateStats,
  onCreateMilestoneClick,
}: MilestonesViewProps) {
  const [filterStatus, setFilterStatus] = useState<"All" | MilestoneStatus>("All");

  const filteredMilestones = milestones.filter((ms) => {
    const matchesStatus = filterStatus === "All" || ms.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      ms.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ms.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ms.deliverables.some((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const totalDeliverables = milestones.reduce((sum, m) => sum + m.deliverables.length, 0);
  const completedDeliverables = milestones.reduce(
    (sum, m) => sum + m.deliverables.filter((d) => d.completed).length,
    0
  );
  const successRatePercent =
    totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;

  const activeGoalsCount = milestones.filter((m) => m.status === "In Progress").length;

  const featured = milestones.find((m) => m.featured) || milestones[0] || null;

  const nextTarget = milestones.find((m) => m.status !== "Achieved") || null;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 uppercase font-montserrat dark:text-white">
            System Milestones
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1 uppercase tracking-wider font-inter dark:text-gray-400">
            Weekly Tracking &amp; Performance Execution
          </p>
        </div>

        <button
          onClick={onCreateMilestoneClick}
          className="bg-gray-900 text-white px-6 py-3 font-montserrat font-bold uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-sm cursor-pointer dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Create Milestone
        </button>
      </div>

      <FeaturedOverview
        milestone={featured}
        onLearnMore={() => {
          if (featured) onViewReport(featured);
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "All"
                ? milestones.length
                : milestones.filter((m) => m.status === tab).length;

            const isSelected = filterStatus === tab;

            return (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest font-montserrat transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:text-white"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 font-black ${
                    isSelected
                      ? "bg-white/20 text-white dark:bg-gray-900/20 dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search milestones..."
              aria-label="Search milestones"
              className="h-8 w-48 rounded border border-gray-200 bg-white pl-8 pr-2 font-inter text-xs text-gray-700 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white"
            />
          </div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest font-inter">
            Showing{" "}
            <strong className="text-gray-900 dark:text-white">{filteredMilestones.length}</strong> of{" "}
            {milestones.length} targets
          </div>
        </div>
      </div>

      {filteredMilestones.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center my-8 dark:border-gray-800 dark:bg-gray-900">
          <Flag className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 font-montserrat uppercase tracking-tight dark:text-white">
            No matching milestones found
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto font-inter dark:text-gray-400">
            Try adjusting your search query or status filter to view other roadmap targets.
          </p>
          <button
            onClick={onCreateMilestoneClick}
            className="mt-4 px-5 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest font-montserrat hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Create New Milestone
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onToggleDeliverable={onToggleDeliverable}
              onViewReport={onViewReport}
              onUpdateStats={onUpdateStats}
            />
          ))}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-gray-900 text-white p-6 flex flex-col justify-between dark:bg-white dark:text-gray-900">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-white dark:bg-gray-900"></div>
            <span className="text-xs font-bold uppercase tracking-widest font-montserrat text-gray-400 dark:text-gray-500">
              Success Rate
            </span>
          </div>
          <div className="my-3">
            <div className="text-5xl font-black italic tracking-tighter font-montserrat">
              {successRatePercent.toFixed(1)}%
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 font-inter dark:text-gray-500">
              Aggregated deliverable completion
            </p>
          </div>
          <div className="w-10 h-1 bg-white dark:bg-gray-900"></div>
        </div>

        <div className="bg-white border border-gray-200 p-6 flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-gray-600 dark:bg-gray-200"></div>
            <span className="text-xs font-bold uppercase tracking-widest font-montserrat text-gray-400">
              Active Goals
            </span>
          </div>
          <div className="my-3">
            <div className="text-5xl font-black text-gray-900 tracking-tighter font-montserrat dark:text-white">
              {activeGoalsCount}
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 font-inter">
              Major initiatives in progress
            </p>
          </div>
          <div className="w-10 h-1 bg-gray-600 dark:bg-gray-200"></div>
        </div>

        <div className="bg-gray-900 text-white p-6 flex flex-col justify-between overflow-hidden relative dark:bg-white dark:text-gray-900">
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2.5 h-2.5 bg-white dark:bg-gray-900"></div>
            <span className="text-xs font-bold uppercase tracking-widest font-montserrat text-gray-400 dark:text-gray-500">
              Next Target
            </span>
          </div>
          <div className="my-3 relative z-10">
            <div className="text-5xl font-black text-white italic tracking-tighter font-montserrat dark:text-gray-900">
              {nextTarget ? (
                <span className="text-2xl not-italic">{nextTarget.dueDate}</span>
              ) : (
                <span className="text-2xl not-italic">Done</span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1 font-inter dark:text-gray-500">
              {nextTarget ? nextTarget.title : "All targets achieved"}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-20 rotate-45 dark:bg-gray-900"></div>
        </div>
      </div>
    </div>
  );
}
