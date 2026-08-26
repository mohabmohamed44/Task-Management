import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/app/Queries/auth.query";
import { useRateLimitState } from "@/app/hooks/useRateLimitState";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";
import MetaData from "../components/MetaData";
import { Card, CardContent } from "@/presentation/components/ui/card";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { mutateAsync: login, isPending } = useLoginMutation();
  const navigate = useNavigate();
  const { isBlocked, timeRemaining } = useRateLimitState("login");
  const { sanitizeValues } = useSanitizedForm<{ email: string }>({ email: "email" });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const isLoading = isPending;

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);

    if (isBlocked) {
      toast.error(`Please wait ${formatTimeRemaining(timeRemaining)} before trying again.`);
      return;
    }

    try {
      const sanitized = sanitizeValues({ email: values.email });
      await login({
        email: sanitized.email,
        password: values.password,
      });
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
        title="Sign In"
        description="Sign in to your workspace"
        path="/auth/login"
        noIndex={true}
        type="website"
      />
      <div className="min-h-screen w-full bg-[#0c0c0c] flex items-center justify-center p-6 selection:bg-zinc-800 selection:text-white">
        <div className="w-full max-w-lg flex flex-col gap-8">
          {/* Card */}
          <Card className="rounded-none border-2 border-gray-400/25 bg-zinc-900/40 backdrop-blur-sm">
            <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#0c0c0c] rounded-sm rotate-45" />
                </div>
                <h1 className="text-4xl font-semibold text-white font-playfair-display">Prioritize</h1>
              </div>
              <h3 className="font-['Playfair_Display'] text-3xl font-light text-white mb-2 text-center">
                Welcome <span className="italic text-zinc-300">Back</span>
              </h3>
              <p className="font-['Inter'] text-sm text-zinc-500 text-center">
                Sign in to your workspace to continue.
              </p>
            </div>
            {/* Error Message */}
            {authError && (
              <div className="mb-5 bg-[#ffdad6]/10 border border-[#ba1a1a]/50 text-red-200 text-xs font-semibold p-3 flex items-center justify-between">
                <span>{authError}</span>
                <button onClick={() => setAuthError(null)} className="p-1 hover:bg-white/10 cursor-pointer shrink-0" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Rate Limit Warning */}
            {isBlocked && (
              <div className="mb-5 bg-[#ffdad6]/10 border border-[#ba1a1a]/50 text-red-200 text-xs font-semibold p-3">
                Too many attempts. Wait {formatTimeRemaining(timeRemaining)} before trying again.
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  id="user-email"
                  placeholder="you@example.com"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  autoComplete="email"
                  spellCheck={false}
                  inputMode="email"
                  aria-label="Email address"
                  aria-invalid={!!form.formState.errors.email}
                  aria-required="true"
                  className="w-full border border-zinc-800 p-3 bg-zinc-950/80 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                />
                {form.formState.errors.email && (
                  <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.email.message as string}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-['Inter'] text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.error("Password reset is not available in this demo.")}
                    aria-label="Forgot password"
                    aria-describedby="user-password-error"
                    aria-required="true"
                    className="font-['Inter'] text-xs text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-label="Password"
                    disabled={isBlocked}
                    className="w-full border border-zinc-800 p-3 pr-12 bg-zinc-950/80 font-['Inter'] text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="font-['Inter'] text-xs text-red-300">{form.formState.errors.password.message as string}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 mt-1 select-none">
                <input
                  {...form.register("rememberMe")}
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 border-zinc-700 bg-zinc-950/80 accent-zinc-400 cursor-pointer"
                  aria-label="Remember me"
                />
                <label htmlFor="rememberMe" className="font-['Inter'] text-xs font-medium text-zinc-500 cursor-pointer">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  type="submit"
                  aria-label="Sign in"
                  disabled={isLoading}
                  className="w-full bg-white text-[#0c0c0c] font-['Inter'] text-sm font-semibold py-3.5 hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Request
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="font-['Inter'] text-xs text-zinc-600 uppercase">or</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                {/* Google Auth */}
                <button
                  type="button"
                  aria-label="Sign in with Google"
                  disabled={isLoading}
                  onClick={handleGoogleAuth}
                  className="w-full bg-transparent text-zinc-400 border border-zinc-800 font-['Inter'] text-sm font-medium py-3 hover:bg-zinc-800/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.12H2.17V16.97C3.98 20.57 7.7 23 12 23Z" fill="#34A853" />
                    <path d="M5.84 14.12C5.62 13.46 5.49 12.74 5.49 12C5.49 11.26 5.62 10.54 5.84 9.88V7.03H2.17C1.42 8.52 1 10.21 1 12C1 13.79 1.42 15.48 2.17 16.97L5.84 14.12Z" fill="#FBBC05" />
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.7 1 3.98 3.43 2.17 7.03L5.84 9.88C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335" />
                  </svg>
                  Sign In with Google
                </button>
              </div>
            </form>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="font-['Inter'] text-sm text-zinc-600">
              Don't have an account?
            </span>{" "}
            <Link
              to="/auth/register"
              className="font-['Inter'] text-sm text-zinc-400 hover:text-white hover:underline font-medium underline-offset-4 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
