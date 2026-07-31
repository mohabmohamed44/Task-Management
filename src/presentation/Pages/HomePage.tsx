import { useState } from "react";
import {
  CheckCircle,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  ListTodo,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/presentation/components/Button";
import { Link } from "react-router";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
import MetaData from "../components/MetaData";
import { useHomeAnalytics } from "@/app/hooks/useHomeAnalytics";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const BackgroundGradient = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-700" />
);

const KanbanIllustration = () => (
  <svg
    viewBox="0 0 900 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-3xl mx-auto"
  >
    <rect width="900" height="500" rx="16" className="fill-gray-100 dark:fill-[#1a1a1a]" />
    {/* Columns */}
    {[
      { x: 30, label: "Backlog", count: 4, color: "gray" },
      { x: 320, label: "In Progress", count: 3, color: "gray" },
      { x: 610, label: "Done", count: 2, color: "gray" },
    ].map((col, ci) => (
      <g key={ci}>
        <rect x={col.x} y={20} width="260" height="460" rx="12" className="fill-white dark:fill-[#262626] stroke-gray-200 dark:stroke-[#333]" strokeWidth="1" />
        <rect x={col.x} y={20} width="260" height="44" rx="12" className="fill-gray-50 dark:fill-[#2a2a2a]" />
        <text x={col.x + 20} y={48} className="fill-gray-900 dark:fill-white font-semibold text-sm" fontWeight="600" fontSize="13">{col.label}</text>
        <circle cx={col.x + 230} cy={42} r="10" className="fill-gray-200 dark:fill-[#444]" />
        <text x={col.x + 230} y={46} textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="11" fontWeight="600">{col.count}</text>
        {/* Cards */}
        {[...Array(col.count)].map((_, cardIdx) => {
          const heights = [70, 60, 80, 55];
          return (
            <g key={cardIdx}>
              <rect
                x={col.x + 14}
                y={78 + cardIdx * (heights[cardIdx] + 14)}
                width="232"
                height={heights[cardIdx]}
                rx="8"
                className="fill-white dark:fill-[#1f1f1f] stroke-gray-200 dark:stroke-[#333]"
                strokeWidth="1"
              />
              <rect
                x={col.x + 24}
                y={90 + cardIdx * (heights[cardIdx] + 14)}
                width="60"
                height="6"
                rx="3"
                className={`fill-gray-300 dark:fill-[#444] ${cardIdx === 0 ? "fill-gray-400 dark:fill-[#555]" : ""}`}
              />
              <rect
                x={col.x + 24}
                y={104 + cardIdx * (heights[cardIdx] + 14)}
                width={140 - cardIdx * 20}
                height="6"
                rx="3"
                className="fill-gray-200 dark:fill-[#3a3a3a]"
              />
              {cardIdx === 0 && (
                <>
                  <circle cx={col.x + 210} cy={104} r="8" className="fill-gray-300 dark:fill-[#444]" />
                  <circle cx={col.x + 228} cy={104} r="8" className="fill-gray-300 dark:fill-[#444]" />
                </>
              )}
              {cardIdx === 2 && (
                <>
                  <rect x={col.x + 24} y={118} width="100" height="6" rx="3" className="fill-gray-200 dark:fill-[#3a3a3a]" />
                  <rect x={col.x + 210} y={135} width="24" height="6" rx="3" className="fill-green-300 dark:fill-green-800/50" />
                </>
              )}
              {cardIdx === 1 && (
                <rect x={col.x + 24} y={124} width="40" height="20" rx="4" className="fill-gray-300/50 dark:fill-[#333]" />
              )}
            </g>
          );
        })}
      </g>
    ))}
    {/* Connection lines */}
    <path d="M290 250 L320 250" className="stroke-gray-300 dark:stroke-[#444]" strokeWidth="1.5" strokeDasharray="4 4" />
    <path d="M580 250 L610 250" className="stroke-gray-300 dark:stroke-[#444]" strokeWidth="1.5" strokeDasharray="4 4" />
  </svg>
);

export default function HomePage() {
  const steps = [
    { id: 1, title: "Welcome", description: "Get started with Prioritize", icon: <Sparkles className="h-4 w-4" /> },
    { id: 2, title: "Set Milestones", description: "Define your objectives", icon: <Target className="h-4 w-4" /> },
    { id: 3, title: "First Task", description: "Create your initial task", icon: <ListTodo className="h-4 w-4" /> },
    { id: 4, title: "Weekly Goals", description: "Set your weekly priorities", icon: <Target className="h-4 w-4" /> },
  ];

  const {
    completedCount,
    pendingCount,
    totalCount,
    completionRate,
  } = useHomeAnalytics();

  const { data: currentUser } = useCurrentUserQuery();

  const [currentStep, setCurrentStep] = useState(() => {
    const hasCompleted = localStorage.getItem("hasCompletedOnboarding");
    return hasCompleted === "true" ? steps.length : 1;
  });

  const [progress, setProgress] = useState(() => {
    const hasCompleted = localStorage.getItem("hasCompletedOnboarding");
    return hasCompleted === "true" ? 100 : 25;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem("hasCompletedOnboarding") === "true";
  });

  const [isLoggedIn] = useState(true);
  const [isNewUser] = useState(true);

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setProgress((nextStep / steps.length) * 100);
    }
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setHasCompletedOnboarding(true);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setHasCompletedOnboarding(true);
  };

  if (isLoggedIn && isNewUser && !hasCompletedOnboarding) {
    return (
      <>
        <MetaData title="Welcome" description="Get started with Prioritize" path="/" type="website" />
        <BackgroundGradient />
        <div className="min-h-screen px-4 md:px-8 pt-12 md:pt-20">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
                Welcome, {currentUser?.name || "Explorer"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Let's set up your workspace.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Setup Progress</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gray-900 dark:bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                      isActive
                        ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-[#1a1a1a]"
                        : isComplete
                          ? "border-gray-200 dark:border-gray-800 opacity-60"
                          : "border-gray-200 dark:border-gray-800 border-dashed opacity-40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${
                      isActive || isComplete
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}>
                      {isComplete ? <CheckCircle className="h-5 w-5" /> : step.icon}
                    </div>
                    <h3 className={`text-sm font-semibold ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleNextStep}
                disabled={currentStep === steps.length}
                className="flex-1 h-12 text-sm font-semibold rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 flex items-center justify-center gap-2"
              >
                {currentStep === steps.length ? "Complete" : "Next Step"}
                {currentStep < steps.length && <ArrowRight className="w-4 h-4" />}
              </Button>
              <Button
                onClick={currentStep === steps.length ? handleCompleteOnboarding : handleSkipOnboarding}
                variant="outline"
                className="flex-1 h-12 text-sm font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {currentStep === steps.length ? "Start Dashboard" : "Skip"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaData title="Command Center" description="Your centralized task and goal management node" path="/" type="website" />
      <BackgroundGradient />

      <div className="min-h-screen selection:text-white selection:bg-gray-900 dark:selection:bg-white dark:selection:text-gray-900">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-20">

          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-semibold tracking-widest uppercase mb-8 text-gray-500 dark:text-gray-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 animate-pulse" />
              System Online
            </motion.div>

            <h1 className="bg-linear-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text pb-4 text-5xl font-bold leading-none tracking-tight text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
              Operational Command Center
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="my-12"
            >
              <KanbanIllustration />
            </motion.div>

            <p className="mb-10 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-balance">
              Your intelligent nexus for tracking workflows, synthesizing goals, and optimizing daily execution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 shadow-xl" asChild>
                <Link to="/tasks">Access Task Node</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-black/70 text-gray-700 dark:text-gray-300" asChild>
                <Link to="/create-task" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Initialize New
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Completed", value: completedCount, suffix: "" },
              { label: "Pending", value: pendingCount, suffix: "" },
              { label: "Total", value: totalCount, suffix: `\u00B7 ${completionRate}% done` },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#111]/50 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-sm font-medium text-gray-400 mb-1">{stat.suffix}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={itemVariants} className="mt-16 max-w-2xl mx-auto">
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center justify-center gap-6 text-sm">
                <Link to="/tasks" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Tasks</Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link to="/goals" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Goals</Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link to="/kanban" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Kanban</Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link to="/statistics" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Analytics</Link>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}
