import { CheckCircle, Circle } from "lucide-react";
import type { UIMilestone } from "../types";

interface MilestoneCardProps {
  milestone: UIMilestone;
  onToggleDeliverable: (milestoneId: string, deliverableId: string) => void;
  onViewReport: (milestone: UIMilestone) => void;
  onUpdateStats: (milestone: UIMilestone) => void;
}

export function MilestoneCard({
  milestone,
  onToggleDeliverable,
  onViewReport,
  onUpdateStats,
}: MilestoneCardProps) {
  const completedCount = milestone.deliverables.filter((d) => d.completed).length;
  const totalCount = milestone.deliverables.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getBadgeStyle = () => {
    switch (milestone.status) {
      case "Achieved":
        return "bg-gray-900 text-white dark:bg-white dark:text-gray-900";
      case "In Progress":
        return "bg-gray-600 text-white dark:bg-gray-200 dark:text-gray-900";
      case "Planned":
        return "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getBarColor = () => {
    switch (milestone.status) {
      case "Achieved":
        return "bg-gray-900 dark:bg-white";
      case "In Progress":
        return "bg-gray-600 dark:bg-gray-200";
      case "Planned":
        return "bg-gray-400 dark:bg-gray-500";
      default:
        return "bg-gray-600 dark:bg-gray-200";
    }
  };

  const getAccentBorder = () => {
    switch (milestone.status) {
      case "Achieved":
        return "bg-gray-900 dark:bg-white";
      case "In Progress":
        return "bg-gray-600 dark:bg-gray-200";
      case "Planned":
        return "bg-gray-300 dark:bg-gray-700";
      default:
        return "bg-gray-600 dark:bg-gray-200";
    }
  };

  const isPlanned = milestone.status === "Planned";

  return (
    <div
      className={`flex flex-col md:flex-row items-stretch border border-gray-200 bg-white transition-all duration-300 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-500 ${
        isPlanned ? "opacity-85 hover:opacity-100" : ""
      }`}
    >
      <div className={`w-2 min-h-[12px] ${getAccentBorder()}`} />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest font-montserrat ${getBadgeStyle()}`}
            >
              {milestone.status}
            </span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-inter dark:text-gray-500">
              Due {milestone.dueDate}
            </span>
            {milestone.priority && (
              <span className="text-[10px] uppercase font-bold font-inter text-gray-500 bg-gray-100 px-2 py-0.5 dark:bg-gray-800 dark:text-gray-400">
                {milestone.priority}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight font-montserrat dark:text-white">
            {milestone.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-inter dark:text-gray-400">
            {milestone.description || "No description provided for this milestone."}
          </p>
        </div>

        <div className="flex-[1.5] grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest font-montserrat text-gray-400">
                Deliverables ({completedCount}/{totalCount})
              </span>
              <span className="text-[10px] text-gray-900 font-black font-inter dark:text-white">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-gray-100 h-1.5 overflow-hidden mb-4 dark:bg-gray-800">
              <div
                className={`${getBarColor()} h-full transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <ul className="space-y-2">
              {milestone.deliverables.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => onToggleDeliverable(milestone.id, item.id)}
                    className="flex items-center gap-2 text-left text-gray-600 hover:text-gray-900 transition-colors group cursor-pointer font-inter dark:text-gray-300 dark:hover:text-white"
                    aria-label={`Toggle ${item.title}`}
                  >
                    <span className="text-gray-600 dark:text-gray-200">
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </span>
                    <span className={item.completed ? "line-through text-gray-400" : "font-medium"}>
                      {item.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest font-montserrat text-gray-400 block mb-3">
                Assigned Team
              </span>
              <div className="flex -space-x-2 items-center">
                {milestone.assignedTeam.map((member) => (
                  <div
                    key={member.id}
                    title={`${member.name} (${member.role})`}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200 relative dark:border-gray-900 dark:bg-gray-700"
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-200">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}

                {milestone.extraTeamCount && milestone.extraTeamCount > 0 && (
                  <div
                    title={`${milestone.extraTeamCount} more team members`}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-[10px] text-white font-bold dark:border-gray-900 dark:bg-white dark:text-gray-900"
                  >
                    +{milestone.extraTeamCount}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => onViewReport(milestone)}
                className="text-[10px] font-bold uppercase tracking-widest font-montserrat text-gray-900 hover:text-gray-600 transition-all border-b-2 border-gray-900 hover:border-gray-600 pb-0.5 dark:text-white dark:hover:text-gray-400 dark:border-white dark:hover:border-gray-400"
              >
                View Report
              </button>

              <button
                onClick={() => onUpdateStats(milestone)}
                className="text-[10px] font-bold uppercase tracking-widest font-montserrat text-gray-400 hover:text-gray-900 transition-all dark:hover:text-white"
              >
                Update Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
