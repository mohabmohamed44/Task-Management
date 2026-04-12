import { useState } from "react";
import {
  CheckCircle,
  Target,
  Users,
  Calendar,
  Zap,
  ArrowRight,
  Sparkles,
  ListTodo,
  ChartNoAxesColumn,
  Rocket,
  Briefcase,
  Star,
  Activity,
  Layers,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/presentation/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
// import { Input } from "@/presentation/components/ui/input";
// import { Label } from "@/presentation/components/ui/label";
import { Link } from "react-router";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
import MetaData from "../components/MetaData";
import { StatsBarChart } from "../components/StatsBarChart";
import { useHomeAnalytics } from "@/app/hooks/useHomeAnalytics";

// Framer Motion Variants
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
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-700">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#334155_1px,transparent_1px)] bg-size[24px_24px] opacity-50 dark:opacity-20" />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/30 dark:bg-blue-600/20 blur-[120px]"
    />
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px]"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/20 dark:bg-emerald-600/10 blur-[120px]"
    />
  </div>
);

export default function HomePage() {
  const steps = [
    { id: 1, title: "Welcome", description: "Get started with Prioritize", icon: <Rocket className="h-4 w-4" /> },
    { id: 2, title: "Set Milestones", description: "Define your objectives", icon: <Target className="h-4 w-4" /> },
    { id: 3, title: "First Task", description: "Create your initial task", icon: <ListTodo className="h-4 w-4" /> },
    { id: 4, title: "Weekly Goals", description: "Set your weekly priorities", icon: <Calendar className="h-4 w-4" /> },
  ];

  const {
    completedCount,
    pendingCount,
    totalCount,
    completionRate,
    weeklyChartData,
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

  const features = [
    { icon: <Target className="h-5 w-5" />, title: "Smart Goals", description: "Set and track your objectives" },
    { icon: <Users className="h-5 w-5" />, title: "Team Collaboration", description: "Work seamlessly with your team" },
    { icon: <Calendar className="h-5 w-5" />, title: "Calendar Sync", description: "Sync with calendar apps" },
    { icon: <Zap className="h-5 w-5" />, title: "Automation", description: "Automate repetitive workflows" },
  ];

  const quickStartTasks = [
    { title: "Update your profile picture", link: "/profile" },
    { title: "Create your first Task", link: "/create-task" },
    { title: "Setup your Weekly Goals", link: "/goals" },
    { title: "View your task analytics dashboard", link: "/statistics" },
  ];

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
        <div className="min-h-screen p-4 md:p-8 pt-12 md:pt-16 selection:text-white selection:bg-blue-600">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-white/10">
                  <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
                    Welcome, {currentUser?.name || "Explorer"}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-medium">
                    Let's architect your workspace.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="px-4 py-2 text-base backdrop-blur-md bg-white/40 dark:bg-black/40 border-gray-300 dark:border-gray-700">
                Step {currentStep} of {steps.length}
              </Badge>
            </motion.header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                {/* Progress Steps */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden rounded-3xl">
                    <CardContent className="pt-8">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Setup Evolution</span>
                        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-3 bg-gray-200/50 dark:bg-gray-800/50 overflow-hidden rounded-full" />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
                        {steps.map((step) => {
                          const isActive = currentStep === step.id;
                          const isComplete = currentStep > step.id;
                          return (
                            <div key={step.id} className="relative group">
                              <div className={`p-5 rounded-2xl transition-all duration-500 border ${
                                isActive ? "bg-white dark:bg-gray-900 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-105" :
                                isComplete ? "bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-70" :
                                "bg-transparent border-dashed border-gray-300 dark:border-gray-700 opacity-50"
                              }`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" :
                                  isComplete ? "bg-green-500 text-white" :
                                  "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                }`}>
                                  {isComplete ? <CheckCircle className="h-6 w-6" /> : step.icon}
                                </div>
                                <h3 className={`font-bold mb-1 ${isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                  {step.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed font-medium">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Step Content */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-gray-200/50 dark:border-white/5 pb-6 bg-white/30 dark:bg-white/5">
                      <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                        <span className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                          {steps[currentStep - 1].icon}
                        </span>
                        {steps[currentStep - 1].title}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {steps[currentStep - 1].description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-8">
                      {/* Interactive Step Content Wrapper with AnimatePresence */}
                      <div className="min-h-[280px]">
                        {currentStep === 1 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                              <h4 className="text-xl font-bold flex items-center gap-2 mb-2 text-blue-900 dark:text-blue-200">
                                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" /> Quick Starters
                              </h4>
                              <p className="text-blue-700/80 dark:text-blue-300/80 font-medium">Unlock the platform's potential immediately.</p>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {quickStartTasks.map((task, idx) => (
                                <Link key={idx} to={task.link} className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    0{idx + 1}
                                  </div>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</span>
                                </Link>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                        {currentStep === 2 && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group bg-white/50 dark:bg-black/50">
                                <Activity className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-4" />
                                <h4 className="font-bold text-xl mb-2">Personal Pulse</h4>
                                <p className="text-gray-500">Track key achievements and personal breakthroughs dynamically.</p>
                              </div>
                              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-2xl transition-all cursor-pointer group bg-white/50 dark:bg-black/50">
                                <Briefcase className="h-10 w-10 text-gray-400 group-hover:text-purple-500 transition-colors mb-4" />
                                <h4 className="font-bold text-xl mb-2">Team Sync</h4>
                                <p className="text-gray-500">Define cross-functional achievements and checkpoints.</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {currentStep === 3 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="relative overflow-hidden bg-gray-900 dark:bg-black p-10 rounded-3xl shadow-2xl border border-gray-800 text-center">
                              <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 mix-blend-screen" />
                              <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-2xl rotate-3 mb-6 shadow-xl shadow-blue-500/30">
                                  <CheckCircle className="h-10 w-10" />
                                </div>
                                <h4 className="text-3xl font-black text-white mb-4 tracking-tight">Initiate Action Sequence</h4>
                                <p className="text-gray-400 max-w-lg mb-8 font-medium text-lg text-balance">
                                  Transform static ideas into dynamic execution. Begin by logging your first imperative task.
                                </p>
                                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-white text-black hover:bg-gray-100 rounded-xl" asChild>
                                  <Link to="/create-task" className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" /> Execute Now
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {currentStep === 4 && (
                          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="p-8 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-white/10">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                  <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-2xl">Macro Planning</h4>
                                  <p className="text-gray-500">Isolate 3-5 critical objectives for the operational week.</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                {["Focus Alignment", "Progress Tracking", "Iterative Review"].map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="font-semibold text-sm">{item}</span>
                                  </div>
                                ))}
                              </div>
                              <Button className="w-full h-14 text-lg font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white" asChild>
                                <Link to="/weekly-goals">Configure Weekly Sprint</Link>
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <Separator className="bg-gray-200 dark:bg-gray-800/50" />

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={handleNextStep}
                          disabled={currentStep === steps.length}
                          className="flex-1 h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                          {currentStep === steps.length ? "Sequence Complete" : "Advance Pipeline"}
                          {currentStep < steps.length && <ArrowRight className="w-5 h-5" />}
                        </Button>
                        <Button
                          onClick={currentStep === steps.length ? handleCompleteOnboarding : handleSkipOnboarding}
                          variant="outline"
                          className="flex-1 h-14 text-lg font-bold rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {currentStep === steps.length ? "Initialize Dashboard" : "Bypass Setup"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column / Asides */}
              <motion.div variants={containerVariants} className="space-y-8">
                {/* Stats Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/30 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5">
                      <CardTitle className="text-xl flex items-center gap-3 font-bold">
                        <ChartNoAxesColumn className="w-6 h-6 text-blue-500" /> Diagnostics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                       <div>
                         <div className="flex justify-between font-semibold mb-2">
                           <span className="text-gray-500">Setup Matrix</span>
                           <span className="text-gray-900 dark:text-white">{progress.toFixed(0)}%</span>
                         </div>
                         <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-800" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                           <div className="text-2xl font-black text-blue-500">{Math.floor(progress / 25)}/4</div>
                           <div className="text-xs font-bold text-gray-400 uppercase mt-1">Modules</div>
                         </div>
                         <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                           <div className="text-2xl font-black text-purple-500">{5 - currentStep}m</div>
                           <div className="text-xs font-bold text-gray-400 uppercase mt-1">ETA</div>
                         </div>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* System Features */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/30 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5">
                      <CardTitle className="text-xl font-bold flex items-center gap-3">
                        <Zap className="w-6 h-6 text-yellow-500" /> Capabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
                        {features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl group-hover:scale-110 transition-transform">
                              {feature.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{feature.title}</h4>
                              <p className="text-sm font-medium text-gray-500">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // MAIN DASHBOARD (Post-Onboarding)
  return (
    <>
      <MetaData title="Command Center" description="Your centralized task and goal management node" path="/" type="website" />
      <BackgroundGradient />
      
      <div className="min-h-screen pt-12 md:pt-20 px-4 md:px-8 selection:text-white selection:bg-purple-600">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Header */}
          <motion.div variants={itemVariants} className="text-center md:pb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 text-sm font-bold tracking-widest uppercase mb-8 shadow-sm"
            >
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              System Online
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 dark:text-white tracking-tighter leading-tight">
              Operational <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-emerald-500">
                Command Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              Your intelligent nexus for tracking workflows, synthesizing goals, and optimizing daily execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 shadow-xl" asChild>
                <Link to="/tasks">Access Task Node</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 backdrop-blur-sm" asChild>
                <Link to="/create-task" className="flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Initialize New
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Interactive HUD / Dashboard */}
          <motion.div variants={itemVariants}>
            <Card className="max-w-6xl mx-auto border border-gray-200/50 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl rounded-4xl overflow-hidden">
              <CardHeader className="p-6 md:p-8 bg-white/30 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-200/50 dark:bg-gray-900/50 p-1 rounded-2xl">
                    <TabsTrigger value="overview" className="rounded-xl font-bold py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-lg">Overview</TabsTrigger>
                    <TabsTrigger value="projects" className="rounded-xl font-bold py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-lg">Networks</TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-xl font-bold py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-lg">Telemetry</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div whileHover={{ y: -5 }}>
                        <Card className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">
                          <CardContent className="p-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Completed</h3>
                            <div className="text-6xl font-black text-gray-900 dark:text-white mb-4">{completedCount}</div>
                            <Progress value={completionRate} className="h-2 bg-emerald-100 dark:bg-emerald-900/30 [&>div]:bg-emerald-500" />
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ y: -5 }}>
                        <Card className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">
                          <CardContent className="p-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Pending</h3>
                            <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-4">{pendingCount}</div>
                            <p className="font-medium text-gray-500">Tasks awaiting execution</p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ y: -5 }}>
                        <Card className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Target className="w-32 h-32" />
                          </div>
                          <CardContent className="p-8 relative z-10">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Payload</h3>
                            <div className="text-6xl font-black text-gray-900 dark:text-white mb-4">{totalCount}</div>
                            <Badge variant="secondary" className="px-3 py-1 font-bold text-sm bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                              Efficacy: {completionRate}%
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="mt-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <Card className="bg-transparent border-0 shadow-none">
                         <CardHeader className="px-0">
                           <CardTitle className="text-2xl font-black">Active Pipelines</CardTitle>
                         </CardHeader>
                         <CardContent className="px-0 space-y-4">
                            {[
                              { label: "Personal Tasks", metric: `${totalCount} nodes`, color: "bg-blue-500" },
                              { label: "Weekly Goals", metric: "Active", color: "bg-emerald-500" },
                              { label: "Milestones", metric: `${completedCount} cleared`, color: "bg-purple-500" }
                            ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-900/80 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                  <span className="font-bold text-lg">{item.label}</span>
                                </div>
                                <Badge variant="outline" className="px-3 py-1 font-semibold">{item.metric}</Badge>
                              </div>
                            ))}
                         </CardContent>
                       </Card>

                       <Card className="bg-linear-to-br from-gray-900 to-black text-white border-0 rounded-3xl overflow-hidden shadow-2xl relative">
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size[24px_24px]" />
                         <CardContent className="p-8 relative z-10 h-full flex flex-col justify-center">
                           <h3 className="text-xl font-bold text-gray-400 mb-8">Performance Array</h3>
                           <div className="grid grid-cols-2 gap-6">
                             <div>
                               <div className="text-5xl font-black text-blue-400 mb-2">{completionRate}%</div>
                               <div className="text-sm font-bold text-gray-500 uppercase">Clear Rate</div>
                             </div>
                             <div>
                               <div className="text-5xl font-black text-emerald-400 mb-2">{completedCount}</div>
                               <div className="text-sm font-bold text-gray-500 uppercase">Delta (7d)</div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-8">
                     <div className="bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8">
                      <StatsBarChart
                        title="Throughput Telemetry"
                        description="Velocity and completion nodes over operational timeframe"
                        data={weeklyChartData}
                        series={[
                          { key: "created", label: "Nodes Instantiated", color: "#3b82f6" },
                          { key: "completed", label: "Nodes Terminated", color: "#8b5cf6" },
                          { key: "goals", label: "Objectives Secured", color: "#10b981" },
                        ]}
                        footerText="Real-time synchronized data"
                        trendText={completionRate > 50 ? "Optimal scaling trajectory" : "Awaiting operational ramp-up"}
                        showTrend={true}
                        className="border-0 shadow-none bg-transparent"
                      />
                     </div>
                  </TabsContent>

                </Tabs>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
