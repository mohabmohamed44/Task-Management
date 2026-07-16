import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterMutation } from "@/app/Queries/auth.query";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";
import MetaData from "../components/MetaData";
import toast from "react-hot-toast";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const slides = [
  {
    id: 0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAf1Ni4GTDgFpGZALIy6iw0uU3p0nb0r3ZbiGQq2NKlTO8OZo5fi-o3c9BUbOZCCPjx-hxeGygdl8BSpYvvH1WTPm7HbtmmAyu8ZVyevyzgMnliyNVQW_XtOxdbfiZ8CEHvicsDwWHzvV9eiwRLsWZS20_H7S42I8XTorKo36LeeH1OxBvnD-GIX-7UpkkdGtA_vCo-nasYGJra6hCAbk8ig45vEF8vnPNG_sF9m4WrqbYjLuPMrb-4ZT1xaWHQi04XLUIWxMKo5tA",
    title: "Engineered for clarity.",
    description: "Start managing your projects with precision.",
  },
  {
    id: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL46Z0te4RSUNzi_jMsInV5vE1TZW9I4-6dcm4d-wDcQGllvWv1g55q6UmoqMnZLx6EpZUXXyYcQAPW_5x4DsoDHlhFYka6DKnOp7s3ExlSjZ3dNNM1q9lTgLs3rmy_A3atVdTVAVdmNeXigW9wTHxFZm48Sr4njyyRX_AJGSL17Dac12O9jshQlW0iM2Cc_rYuP5-Kaqlw-KaRDUCQDYCS--OjxXXOqSqKI8v0jKilDvjfhxuzWrRDx8zP09_hzR38GpRD2tAhRo",
    title: "Built for speed.",
    description: "Collaborate and deploy in a matter of seconds.",
  },
  {
    id: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8h8QGdX-tfaZjN0ppJgHBNeCFbgZw72WQxQs-DgZSkSZYjYpMkvyzttPru089kdGTjaCP-Q8oUfLwUHGwegstmM36J_dziOSTHM3nmROyaNoMwj9jN7AEGbRE_m2KVp7fnePCP-g9BGQl0cw5bObzP7BpNIoY4dQV95eVfL5KJeR3OTpRvEs0VealruZZzivQx9FGFTr1UOUsd8krMH4meAYHyG2LW6xWPQfCjFXcdfiEbloYQ9dt72O6CntTl6wTiMhC4-roQmw",
    title: "Designed to scale.",
    description: "Powering modern teams with seamless organization.",
  },
];

export const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveredCarousel, setIsHoveredCarousel] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { mutateAsync: register, isPending } = useRegisterMutation();
  const navigate = useNavigate();
  const { sanitizeValues } = useSanitizedForm<{ email: string }>({ email: "email" });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const isLoading = isPending;

  useEffect(() => {
    if (isHoveredCarousel) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveredCarousel]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const onSubmit = async (values: SignupFormValues) => {
    setAuthError(null);

    try {
      const sanitized = sanitizeValues({ email: values.email });
      const name = `${values.firstName.trim()} ${values.lastName.trim()}`;
      await register({
        email: sanitized.email,
        password: values.password,
        name,
      });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      let message = "An unexpected error occurred. Please try again.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      setAuthError(message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.error(`Google sign-in error: ${error.message}`);
      }
    } catch (err: any) {
      toast.error("Unexpected error during Google sign-in.");
      console.error("Unexpected error", err);
    }
  };

  return (
    <>
      <MetaData
        title="Create Account"
        description="Create your Prioritize account"
        path="/auth/register"
        noIndex={true}
        type="website"
      />
      <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased flex flex-col md:flex-row">
        {/* Left Panel - Form */}
        <main className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 order-2 md:order-1 bg-[#09090b] border-r border-zinc-800/50 relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-400/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-zinc-600/5 rounded-full blur-[80px]" />
            <svg className="w-full h-full opacity-[0.03]" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-left" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-left)" />
            </svg>
          </div>

          <div className="w-full max-w-110 flex flex-col gap-10 relative z-10">
            {/* Logo & Headline */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm rotate-45" />
                </div>
                <span className="font-['Montserrat'] text-lg font-semibold tracking-tight uppercase text-white select-none">
                  Prioritize
                </span>
              </div>
              <h1 className="font-['Montserrat'] text-3xl font-bold text-white tracking-tight leading-tight">
                Create your Prioritize account
              </h1>
              <p className="font-['Inter'] text-sm text-zinc-400">
                Start managing your projects with precision.
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="bg-[#ffdad6]/10 border border-[#ba1a1a]/50 text-red-200 text-xs font-semibold rounded p-3 flex items-center justify-between">
                <span>{authError}</span>
                <button onClick={() => setAuthError(null)} className="p-1 hover:bg-white/10 rounded cursor-pointer shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter'] text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    {...form.register("firstName")}
                    placeholder="John"
                    className="w-full border border-zinc-800 rounded p-3 bg-zinc-950 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                  />
                  {form.formState.errors.firstName && (
                    <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.firstName.message as string}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter'] text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    {...form.register("lastName")}
                    placeholder="Doe"
                    className="w-full border border-zinc-800 rounded p-3 bg-zinc-950 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                  />
                  {form.formState.errors.lastName && (
                    <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.lastName.message as string}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  autoComplete="email"
                  spellCheck={false}
                  className="w-full border border-zinc-800 rounded p-3 bg-zinc-950 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                />
                {form.formState.errors.email && (
                  <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.email.message as string}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full border border-zinc-800 rounded p-3 pr-12 bg-zinc-950 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.password.message as string}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...form.register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full border border-zinc-800 rounded p-3 pr-12 bg-zinc-950 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.confirmPassword.message as string}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-['Montserrat'] text-xs font-semibold py-4 rounded hover:bg-zinc-200 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      Processing Request
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>

                {/* Google Auth */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleAuth}
                  className="w-full bg-transparent text-zinc-300 border border-zinc-800 font-['Montserrat'] text-xs font-bold uppercase py-4 rounded hover:bg-zinc-900 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.12H2.17V16.97C3.98 20.57 7.7 23 12 23Z" fill="#34A853" />
                    <path d="M5.84 14.12C5.62 13.46 5.49 12.74 5.49 12C5.49 11.26 5.62 10.54 5.84 9.88V7.03H2.17C1.42 8.52 1 10.21 1 12C1 13.79 1.42 15.48 2.17 16.97L5.84 14.12Z" fill="#FBBC05" />
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.7 1 3.98 3.43 2.17 7.03L5.84 9.88C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335" />
                  </svg>
                  Sign Up with Google
                </button>
              </div>
            </form>

            {/* Mode Toggle */}
            <div className="text-center">
              <span className="font-['Inter'] text-sm text-zinc-500">
                Already have an account?
              </span>{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="font-['Inter'] text-sm text-zinc-300 hover:text-white hover:underline font-semibold underline-offset-4 cursor-pointer transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>

        {/* Right Panel - Carousel */}
        <aside
          className="w-full md:w-1/2 h-[45vh] md:h-screen relative bg-[#000000] overflow-hidden order-1 md:order-2"
          onMouseEnter={() => setIsHoveredCarousel(true)}
          onMouseLeave={() => setIsHoveredCarousel(false)}
        >
          {/* Slide Images */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slides[currentSlide].image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.65 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity filter contrast-125 pointer-events-none"
                referrerPolicy="no-referrer"
                alt={slides[currentSlide].title}
              />
            </AnimatePresence>
          </div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-right" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-right)" />
            </svg>
          </div>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Status Badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 select-none">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/90 font-mono tracking-widest uppercase">System Live</span>
          </div>

          {/* Bottom Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
            <div className="min-h-35 flex flex-col justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <h2 className="font-['Montserrat'] text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight max-w-md select-none">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="font-['Inter'] text-sm md:text-base text-white/70 max-w-sm font-light leading-relaxed select-none">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-10 md:mt-12">
              <div className="flex gap-2.5 items-center">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === index ? "bg-white w-6" : "bg-white/30 hover:bg-white/60 w-1.5"
                    }`}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 border border-white/20 rounded flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 border border-white/20 rounded flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm cursor-pointer"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default SignUpPage;