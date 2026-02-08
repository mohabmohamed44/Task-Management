import { useState } from "react";
import { CheckCircle, Target, Users, Calendar, Zap, ArrowRight, Trophy, Sparkles, ListTodo, ChartNoAxesColumn } from "lucide-react";
import { Button } from "@/presentation/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { Link } from "react-router";

export default function HomePage() {
  const steps = [
    { id: 1, title: "Welcome", description: "Get started with Prioritize" },
    { id: 2, title: "Set Goals", description: "Define your objectives" },
    { id: 3, title: "Invite Team", description: "Collaborate with others" },
    { id: 4, title: "First Task", description: "Create your initial task" },
  ];

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
      icon: <Target className="h-6 w-6" />,
      title: "Smart Goals",
      description: "Set and track your objectives with intelligent insights",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team in real-time",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Calendar Sync",
      description: "Sync with your favorite calendar apps",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automation",
      description: "Automate repetitive tasks and workflows",
    },
  ];

  const quickStartTasks = [
    "Update your profile picture",
    "Create your first Task",
    "Setup your Weekly Goals",
    "View your task analytics dashboard",
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
    // In a real app, you would update user status in your database
    localStorage.setItem("hasCompletedOnboarding", "true");
    setCurrentStep(steps.length);
    setProgress(100);
  };

  

  // Show onboarding for new users after login/register
  if (isLoggedIn && isNewUser && progress < 100) {
    return (
      <div className="min-h-screen  p-4 md:p-8 selection:text-white selection:bg-black dark:selection:bg-gray-600 dark:selection:text-gray-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome to Prioritize 🎉
                </h1>
                <p className="text-muted-foreground mt-1">
                  Let's set up your workspace in a few simple steps
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              Step {currentStep} of {steps.length}
            </Badge>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Onboarding Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 text-lg dark:text-gray-400">Setup Progress</span>
                      <span className="font-semibold text-lg">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`text-center p-3 rounded-lg transition-all ${
                            currentStep >= step.id
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                              currentStep >= step.id
                                ? "bg-primary text-white dark:text-black"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {currentStep > step.id ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <h3 className="font-medium text-sm">{step.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Step Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {currentStep === 1 && "👋 Welcome to Prioritize!"}
                    {currentStep === 2 && "🎯 Set Your Goals"}
                    {currentStep === 3 && "👥 Build Your Team"}
                    {currentStep === 4 && "🚀 Create Your First Task"}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 && "Let's personalize your experience"}
                    {currentStep === 2 && "Define what you want to achieve"}
                    {currentStep === 3 && "Collaborate with your teammates"}
                    {currentStep === 4 && "Get started with your first task"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h4 className="font-semibold mb-2">Quick Setup Guide</h4>
                        <p className="text-sm text-muted-foreground">
                          Complete these steps to unlock all features and optimize your workflow.
                        </p>
                      </div>
                      <ul className="space-y-3">
                        {quickStartTasks.map((task, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                              {index + 1}
                            </div>
                            <span className="text-foreground">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                          <Target className="h-8 w-8 text-primary mb-3" />
                          <h4 className="font-semibold">Personal Goals</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Set individual objectives and track personal progress
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                          <Users className="h-8 w-8 text-primary mb-3" />
                          <h4 className="font-semibold">Team Objectives</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Define team goals and align with company vision
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Invite Your Team</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Collaboration is key to success. Invite team members to work together.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="Enter email addresses"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          <Button size="sm">Send Invites</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-">
                      <div className="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-800 ">
                        <div className="flex items-center gap-3 mb-3">
                          <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                          <h4 className="font-semibold">You're Almost There!</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Create your first task to experience the power of TaskFlow. You'll be able to:
                        </p>
                        <ul className="mt-3 space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            Track progress in real-time
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            Set deadlines and reminders
                          </li>
                          <li className="flex items-center gap-2">Task Management Reimagined
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            Collaborate with team members
                          </li>
                        </ul>
                      </div>
                      <Button className="w-full" size="lg">
                        Create Your First Task
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleNextStep}
                      disabled={currentStep === steps.length}
                      className="flex-1"
                      size="lg"
                    >
                      {currentStep === steps.length ? "Completed" : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={currentStep === steps.length ? handleCompleteOnboarding : handleSkipOnboarding}
                      variant={currentStep === steps.length ? "default" : "outline"}
                      className="flex-1"
                      size="lg"
                    >
                      {currentStep === steps.length ? "Finish Setup" : "Skip Setup"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Features Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">✨ Features You'll Love</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ChartNoAxesColumn />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Setup Progress</span>
                      <span className="font-semibold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Features Unlocked</span>
                      <span className="font-semibold">{Math.floor(progress / 25)}/4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estimated Time</span>
                      <span className="font-semibold">{5 - currentStep} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                className="w-full"
              >
                <Link to="/tasks" className="flex items-center gap-2">
                  <ListTodo size={20}/> 
                  Go to your Tasks
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>You can always access this setup guide from your profile settings</p>
          </footer>
        </div>
      </div>
    );
  }

  // Normal homepage for users who completed onboarding or aren't logged in
  return (
    <div className="min-h-screen selection:text-white selection:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Task <span className="text-primary">Management</span> Reimagined
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Organize, prioritize, and conquer your tasks with our intuitive platform designed for individuals and teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="gap-2">
              <Link to="/tasks">
                See Your Tasks
              </Link>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Link to="/create-task">
              Add a Task
              </Link>

              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          {/* Dashboard Preview */}
          <Card className="max-w-6xl mx-auto shadow-xl shadow-muted/20 border">
            <CardHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">128</div>
                    <Progress value={75} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-1">3 due this week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">94%</div>
                    <Badge variant="outline" className="mt-1">+12% this month</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}