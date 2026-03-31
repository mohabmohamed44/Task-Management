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
import { Button } from '@/presentation/components/ui/button';
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
import { Loader2, Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "@/app/Queries/auth.query";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";
import MetaData from "../components/MetaData";
// Validation schema for signup
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: register, isPending} = useRegisterMutation();
  const navigate = useNavigate();
  
  // Initialize sanitization hook for name and email fields
  const { sanitizeValues } = useSanitizedForm<{ name: string; email: string }>({
    name: 'username',
    email: 'email'
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Sanitize name and email before registration
      const sanitized = sanitizeValues({ 
        name: values.name, 
        email: values.email 
      });
      
      // Simulate API call for signup
      const response = await register({
        email: sanitized.email,
        password: values.password,
        name: sanitized.name
      });
      console.log('Signup response:', response);
      navigate('/auth/login');
      // Handle signup logic here
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Social sign up with ${provider}`);
    // Handle social signup logic
  };

  const password = form.watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "Empty" };
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    let label = "Weak";
    if (strength >= 75) label = "Strong";
    else if (strength >= 50) label = "Medium";
    else if (strength > 0) label = "Weak";
    
    return { strength, label };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <>
    <MetaData 
      title="Register"
      description="Create a new Account to have full access into our System"
      path="/auth/register"
      type="website"
    />
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 selection:bg-black selection:text-white">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl border-border/50 bg-background">
        <CardHeader className="space-y-1 text-center px-4 sm:px-6 md:px-8">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            Fill in your details to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 px-4 sm:px-6 md:px-8">
          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleSocialSignUp('google')}
              className="w-full hover:bg-accent/50"
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
              onClick={() => handleSocialSignUp('github')}
              className="w-full hover:bg-accent/50"
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
                Or sign up with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="John Doe"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          type="email"
                          spellCheck={false}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          autoComplete="email"
                          {...field}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10"
                          onCopy={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Password strength:
                          </span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.label === "Strong" ? "text-green-600 dark:text-green-400" :
                            passwordStrength.label === "Medium" ? "text-yellow-600 dark:text-yellow-400" :
                            "text-red-600 dark:text-red-400"
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.label === "Strong" ? "bg-green-600 dark:bg-green-400" :
                              passwordStrength.label === "Medium" ? "bg-yellow-600 dark:bg-yellow-400" :
                              "bg-red-600 dark:bg-red-400"
                            }`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                        
                        {/* Password Requirements */}
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          <div className="flex items-center">
                            <Shield className={`h-3 w-3 mr-1 ${
                              password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`} />
                            <span className={`text-xs ${
                              password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`}>
                              Min. 8 characters
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Shield className={`h-3 w-3 mr-1 ${
                              /[A-Z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`} />
                            <span className={`text-xs ${
                              /[A-Z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`}>
                              Uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Shield className={`h-3 w-3 mr-1 ${
                              /[a-z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`} />
                            <span className={`text-xs ${
                              /[a-z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`}>
                              Lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Shield className={`h-3 w-3 mr-1 ${
                              /[^A-Za-z0-9]/.test(password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`} />
                            <span className={`text-xs ${
                              /[^A-Za-z0-9]/.test(password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            }`}>
                              Special character
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isPending}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6 md:px-8">
          <Separator />
          <div className="text-center text-md text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="px-0 font-semibold text-md"
              onClick={() => console.log('Navigate to login')}
            >
              <Link to={"/auth/login"}>
                Sign in
              </Link>
            </Button>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            By creating an account, you agree to our{" "}
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
    </>
  );
};

export default SignUpPage;