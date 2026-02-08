import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/Button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Separator } from '@/presentation/components/ui/separator';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/presentation/components/ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/app/Queries/auth.query";
import { useRateLimitState } from "@/app/hooks/useRateLimitState";
import { useDebounce } from "@/app/hooks/useDebounce";
import toast from "react-hot-toast";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";

// Validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional()
});

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLoginMutation();
  const navigate = useNavigate();
  
  // Initialize sanitization hook for email field
  const { sanitizeValues } = useSanitizedForm<{ email: string }>({
    email: 'email'
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });


  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email, 500);
  
  const {isBlocked, remainingAttempts, timeRemaining} = useRateLimitState(debouncedEmail, 'login');
  const formatTimeRemaining = (ms: number) : string => {
    const minutes = Math.floor(ms / 6000);
    const seconds = Math.floor((ms % 6000) / 1000);
    return `${minutes}: ${seconds.toString().padStart(2,'0')}`
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    if (isBlocked) {
      toast.error(`please Wait ${formatTimeRemaining(timeRemaining)} before trying again. `)
    }

    try {
      // Sanitize email before login
      const sanitized = sanitizeValues({ email: values.email });
      
      const response = await login({
        email: sanitized.email,
        password: values.password,
      });
      
      // If we get here, login was successful (no error thrown)
      console.log("Login successful:", response);
      // Navigate to home page after successful login
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Extract error message from various possible error formats
      let errorMessage = "An error occurred during login. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Display error message to user
      form.setError("root", {
        type: "manual",
        message: errorMessage
      });
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Navigate to forgot password page
  };
  // TODO:: Social Media Login Feature 
  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // Handle social login logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:text-white selection:bg-black">
      <Card className="w-full max-w-md shadow-sm border-border/40 bg-background">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin('google')}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin('github')}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {isBlocked && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 dark:bg-yellow-900 dark:border-yellow-800">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                </div>
              )}

              {/* Remaining Attempts */}
              {!isBlocked && remainingAttempts < 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 dark:bg-yellow-900 dark:border-yellow-600">
                  <p className="text-sm text-yellow-700 dark:text-yellow-100">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                </div>
              )}

              {form.formState.errors.root && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-10"
                          {...field}
                          disabled={isBlocked}
                          onChange={(e) => {
                            field.onChange(e);
                            setEmail(e.target.value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={handleForgotPassword}
                        className="px-0 font-normal"
                        disabled={isBlocked}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...field}
                          disabled={isBlocked}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isPending || isBlocked}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : isBlocked ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Wait {formatTimeRemaining(timeRemaining)} before trying again
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="px-0 font-semibold"
              onClick={() => console.log('Navigate to sign up')}
            >
              <Link to="/auth/register">Sign Up</Link>
            </Button>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <Button variant="link" className="px-0 text-xs h-auto font-normal">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-0 text-xs h-auto font-normal">
              Privacy Policy
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;