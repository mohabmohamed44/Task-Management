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
} from "lucide-react";
import { Button } from "@/presentation/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Link } from "react-router";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
import MetaData from "../components/MetaData";
import { StatsBarChart } from "../components/StatsBarChart";
import { useHomeAnalytics } from "@/app/hooks/useHomeAnalytics";

export default function HomePage() {
  const steps = [
    { id: 1, title: "Welcome", description: "Get started with Prioritize", icon: <Rocket className="h-4 w-4" />},
    { id: 2, title: "Set Milestones", description: "Define your objectives", icon: <Target className="h-4 w-4" />},
    { id: 3, title: "First Task", description: "Create your initial task", icon: <ListTodo className="h-4 w-4" /> },
    { id: 4, title: "Weekly Goals", description: "Set your weekly priorities", icon: <Calendar className="h-4 w-4" />},
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

  // Simulate user authentication state
  const [isLoggedIn] = useState(true);
  const [isNewUser] = useState(true);

  const features = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Smart Goals",
      description: "Set and track your objectives with intelligent insights",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team in real-time",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Calendar Sync",
      description: "Sync with your favorite calendar apps",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Automation",
      description: "Automate repetitive tasks and workflows",
    },
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
    setCurrentStep(steps.length);
    setProgress(100);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setCurrentStep(steps.length);
    setProgress(100);
  };

  // Show improved onboarding for new users after login/register
  if (isLoggedIn && isNewUser && progress < 100) {
    return (
      <>
        <MetaData
          title="Welcome"
          description="Get started with Prioritize - Your minimalist task manager"
          path="/"
          type="website"
        />
      <div className="min-h-screen p-4 md:p-8 selection:text-white selection:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header with greeting and progress */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm">
                <Sparkles className="h-7 w-7 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome to Prioritize, {currentUser?.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                  Let's set up your workspace in a few simple steps
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2 text-base border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              Step {currentStep} of {steps.length}
            </Badge>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Onboarding Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress bar with step indicators */}
              <Card className="border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900">
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-600 dark:text-gray-400">Setup Progress</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`relative p-4 rounded-xl transition-all duration-300 border ${
                            currentStep >= step.id
                              ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${
                              currentStep >= step.id
                                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {currentStep > step.id ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          <h3 className="font-semibold text-center text-sm text-gray-800 dark:text-gray-200">{step.title}</h3>
                          <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                          {currentStep === step.id && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-800 dark:bg-gray-200 rounded-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Step Content - Interactive Cards */}
              <Card className="border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900 overflow-hidden">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-gray-100">
                    <span className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {currentStep === 1 && <Rocket className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
                      {currentStep === 2 && <Target className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
                      {currentStep === 3 && <ListTodo className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
                      {currentStep === 4 && <Calendar className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
                    </span>
                    {steps[currentStep - 1].title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                    {steps[currentStep - 1].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Step 1: Welcome & Quick Actions */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold flex items-center gap-2 text-lg mb-2 text-gray-800 dark:text-gray-200">
                          <Star className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          Get started in minutes
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Complete these quick actions to unlock the full potential of Prioritize.
                        </p>
                      </div>
                      <ul className="space-y-3">
                        {quickStartTasks.map((task, index) => (
                          <Link key={index} to={task.link} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold group-hover:scale-110 transition">
                              {index + 1}
                            </div>
                            <span className="flex-1 text-gray-800 dark:text-gray-200">{task.title}</span>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition text-gray-600 dark:text-gray-400">
                              Do it <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Step 2: Set Goals */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all cursor-pointer group">
                          <Target className="h-8 w-8 text-gray-700 dark:text-gray-300 mb-3 group-hover:scale-110 transition" />
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Personal Milestones</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Track key achievements and personal breakthroughs
                          </p>
                        </div>
                        <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all cursor-pointer group">
                          <Briefcase className="h-8 w-8 text-gray-700 dark:text-gray-300 mb-3 group-hover:scale-110 transition" />
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Team Milestones</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Define team achievements and project checkpoints
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Label htmlFor="goal-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">Or type a custom goal</Label>
                        <div className="flex gap-2 mt-2">
                          <Input id="goal-input" placeholder="e.g., Launch new website" className="border-gray-300 dark:border-gray-700" />
                          <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">Add</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Create First Task */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Hero Card */}
                      <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 p-8 rounded-2xl shadow-xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                        
                        <div className="relative z-10 text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-inner">
                            <CheckCircle className="h-10 w-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-2">
                            Create Your First Task
                          </h4>
                          <p className="text-blue-100 max-w-md mx-auto">
                            Turn your ideas into action. Start by adding a task and experience the satisfaction of getting things done.
                          </p>
                        </div>
                      </div>

                      {/* Quick Benefits */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-green-800 dark:text-green-300 block">Stay Organized</span>
                            <span className="text-xs text-green-600 dark:text-green-400">Never forget a task</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-purple-800 dark:text-purple-300 block">Track Progress</span>
                            <span className="text-xs text-purple-600 dark:text-purple-400">See your achievements</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-orange-800 dark:text-orange-300 block">Plan Ahead</span>
                            <span className="text-xs text-orange-600 dark:text-orange-400">Set due dates</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        size="lg" 
                        className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                        asChild
                      >
                        <Link to="/create-task" className="flex items-center justify-center gap-3">
                          <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          Create Your First Task
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Step 4: Weekly Goals */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                          <Calendar className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                          <div>
                            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Plan Your Week</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Set 3-5 key goals to focus on this week
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            Stay focused on priorities
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            Track weekly progress
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            Review and adjust goals
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Label htmlFor="weekly-goal" className="text-sm font-medium text-gray-700 dark:text-gray-300">This week's priority</Label>
                        <Input id="weekly-goal" placeholder="e.g., Complete project proposal" className="mt-1 border-gray-300 dark:border-gray-700" />
                        <div className="flex gap-3 mt-3">
                          <div className="flex-1">
                            <Label htmlFor="category" className="text-sm text-gray-700 dark:text-gray-300">Category</Label>
                            <select id="category" className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                              <option>Work</option>
                              <option>Personal</option>
                              <option>Learning</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="week-day" className="text-sm text-gray-700 dark:text-gray-300">Target Day</Label>
                            <select id="week-day" className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                              <option>Monday</option>
                              <option>Tuesday</option>
                              <option>Wednesday</option>
                              <option>Thursday</option>
                              <option>Friday</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900" size="lg" asChild>
                        <Link to="/weekly-goals">
                          Go to Weekly Goals
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  <Separator className="my-2 bg-gray-200 dark:bg-gray-800" />

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleNextStep}
                      disabled={currentStep === steps.length}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 disabled:opacity-50"
                      size="lg"
                    >
                      {currentStep === steps.length ? "All Steps Completed" : "Continue"}
                      {currentStep < steps.length && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={currentStep === steps.length ? handleCompleteOnboarding : handleSkipOnboarding}
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      size="lg"
                    >
                      {currentStep === steps.length ? "Finish & Go to Dashboard" : "Skip for now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Insights & Quick Actions */}
            <div className="space-y-6">
              {/* Feature Highlights */}
              <Card className="border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    Features you'll love
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      >
                        <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{feature.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats & Next Steps */}
              <Card className="border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <ChartNoAxesColumn className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    Your progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Setup completed</span>
                      <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-600 dark:text-gray-400">Features unlocked</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{Math.floor(progress / 25)}/4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Time remaining</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{5 - currentStep} min</span>
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-800" />
                    <div className="pt-2">
                      <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Recommended next</h4>
                      <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400" />
                          <span>Explore the dashboard</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400" />
                          <span>Connect your calendar</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Link to Tasks */}
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-800 dark:text-gray-200"
                asChild
              >
                <Link to="/tasks" className="flex items-center justify-center gap-2">
                  <ListTodo size={18} />
                  Go to My Tasks
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer Hint */}
          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>You can always revisit this setup guide from your profile settings.</p>
          </footer>
        </div>
      </div>
      </>
    );
  }

  // Normal homepage for users who completed onboarding or aren't logged in
  return (
    <>
      <MetaData
        title="Home"
        description="Prioritize - Your minimalist task manager to help you focus on what matters"
        path="/"
        type="website"
      />
    <div className="min-h-screen selection:text-white selection:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
            <Sparkles className="h-8 w-8 text-gray-700 dark:text-gray-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Task <span className="text-blue-600 dark:text-blue-400">Management</span> Reimagined
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            Organize, prioritize, and conquer your tasks with our intuitive platform designed for individuals and teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="gap-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900" role="button" name="Tasks button" asChild>
              <Link to="/tasks">
                See Your Tasks
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" role="button" name="Create a Task"  asChild>
              <Link to="/create-task">
                Add a Task
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Dashboard Preview */}
          <Card className="max-w-6xl mx-auto shadow-xl border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Overview</TabsTrigger>
                  <TabsTrigger value="projects" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Projects</TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium text-gray-600 dark:text-gray-400">Completed Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completedCount}</div>
                        <Progress value={completionRate} className="mt-2 bg-gray-200 dark:bg-gray-700" />
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium text-gray-600 dark:text-gray-400">Pending Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pendingCount}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Tasks to complete</p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium text-gray-600 dark:text-gray-400">Total Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalCount}</div>
                        <Badge variant="outline" className="mt-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">Completion: {completionRate}%</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Active Projects</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Your current project workflow</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Personal Tasks</span>
                            <Badge variant="outline" className="border-gray-300 dark:border-gray-700">{totalCount} tasks</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Weekly Goals</span>
                            <Badge variant="outline" className="border-gray-300 dark:border-gray-700">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Milestones</span>
                            <Badge variant="outline" className="border-gray-300 dark:border-gray-700">{completedCount} done</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Quick Stats</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Project performance metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                          </div>
                          <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Done This Week</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <StatsBarChart
                    title="Tasks & Goals Overview"
                    description="Track your task creation and completion"
                    data={weeklyChartData}
                    series={[
                      { key: "created", label: "Tasks Created", color: "#3b82f6" },
                      { key: "completed", label: "Tasks Completed", color: "#8b5cf6" }, // Changed to purple to distinguish from goals
                      { key: "goals", label: "Goals Completed", color: "#10b981" },
                    ]}
                    footerText="Weekly activity based on your real task data"
                    trendText={`${completionRate > 50 ? "Trending up" : "Getting started"} this week`}
                    showTrend={true}
                    className="border-0 shadow-none"
                  />
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}