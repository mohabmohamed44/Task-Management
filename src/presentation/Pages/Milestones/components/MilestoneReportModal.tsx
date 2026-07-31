import { CheckCircle, Clock, Printer, X } from "lucide-react";
import type { UIMilestone } from "../types";

interface MilestoneReportModalProps {
  milestone: UIMilestone | null;
  onClose: () => void;
  onPrintReport?: () => void;
}

export function MilestoneReportModal({
  milestone,
  onClose,
  onPrintReport,
}: MilestoneReportModalProps) {
  if (!milestone) return null;

  const completedCount = milestone.deliverables.filter((d) => d.completed).length;
  const totalCount = milestone.deliverables.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded max-w-2xl w-full p-6 shadow-2xl relative my-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between border-b border-gray-200 pb-4 mb-5 dark:border-gray-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest font-montserrat text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
              Executive Report &bull; {milestone.status}
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 font-montserrat mt-1 dark:text-white">
              {milestone.title}
            </h2>
            <p className="text-xs text-gray-500 font-inter dark:text-gray-400">
              Target Due Date: {milestone.dueDate}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report"
            className="p-1 text-gray-500 hover:text-gray-900 rounded transition-colors dark:text-gray-400 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs text-gray-800 font-inter dark:text-gray-200">
          <div>
            <h3 className="font-montserrat font-bold uppercase text-[11px] tracking-wider text-gray-500 mb-1 dark:text-gray-400">
              Overview &amp; Scope
            </h3>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 leading-relaxed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              {milestone.description || "No description provided for this milestone."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold font-montserrat text-gray-500 block dark:text-gray-400">
                Completion Rate
              </span>
              <span className="text-3xl font-extrabold text-gray-900 font-montserrat dark:text-white">
                {progressPercent}%
              </span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold font-montserrat text-gray-500 block dark:text-gray-400">
                Deliverables Completed
              </span>
              <span className="text-3xl font-extrabold text-gray-900 font-montserrat dark:text-white">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold font-montserrat text-gray-500 block dark:text-gray-400">
                Priority Tag
              </span>
              <span className="text-xl font-bold text-gray-900 font-montserrat mt-1 block dark:text-white">
                {milestone.priority || "High"} Priority
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-montserrat font-bold uppercase text-[11px] tracking-wider text-gray-500 mb-2 dark:text-gray-400">
              Deliverables Status
            </h3>
            <div className="space-y-2">
              {milestone.deliverables.length === 0 ? (
                <p className="p-3 text-center border border-dashed border-gray-300 rounded text-gray-400 dark:border-gray-700 dark:text-gray-500">
                  No deliverables assigned yet
                </p>
              ) : (
                milestone.deliverables.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-2">
                      <span className={item.completed ? "text-gray-600 dark:text-gray-200" : "text-gray-400"}>
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </span>
                      <span
                        className={`font-medium ${
                          item.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-montserrat ${
                        item.completed
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          : "bg-gray-50 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                      }`}
                    >
                      {item.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-montserrat font-bold uppercase text-[11px] tracking-wider text-gray-500 mb-2 dark:text-gray-400">
              Assigned Personnel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {milestone.assignedTeam.length === 0 ? (
                <p className="col-span-full p-3 text-center border border-dashed border-gray-300 rounded text-gray-400 dark:border-gray-700 dark:text-gray-500">
                  No team members assigned
                </p>
              ) : (
                milestone.assignedTeam.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {milestone.logs && milestone.logs.length > 0 && (
            <div>
              <h3 className="font-montserrat font-bold uppercase text-[11px] tracking-wider text-gray-500 mb-2 dark:text-gray-400">
                Audit Trail &amp; History
              </h3>
              <div className="border border-gray-200 rounded bg-gray-50 divide-y divide-gray-200 max-h-36 overflow-y-auto dark:border-gray-700 dark:bg-gray-800 dark:divide-gray-700">
                {milestone.logs.map((log, index) => (
                  <div key={index} className="p-2.5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{log.action}</span>
                      <span className="text-gray-500 ml-2 dark:text-gray-400">by {log.author}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{log.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-6 dark:border-gray-800">
          <button
            onClick={() => {
              if (onPrintReport) onPrintReport();
              else window.print();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded font-bold text-xs font-inter hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Printer className="h-4 w-4" />
            Export PDF Report
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded font-bold hover:bg-black uppercase font-montserrat tracking-wider text-xs dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
