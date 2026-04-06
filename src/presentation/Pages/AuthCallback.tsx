import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { TokenStorage } from "@/InfraStructure/storage/token.storage";
import { API_URL } from "@/lib/constants";
import axios from "axios";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 1. Get the session directly from Supabase JS (which parses the URL hash)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) throw new Error("No session found in URL hash or local storage");

        // 2. Send the Supabase access_token to your backend to sync the user 
        // and get your custom backend JWT token
        const response = await axios.post(`${API_URL}/auth/oauth/sync`, {
          access_token: session.access_token,
        });

        // 3. Store the backend's Custom JWT token
        TokenStorage.set(response.data.token);
        
        toast.success("Login Successful", {
          position: 'top-center',
          style: {
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '10px',
          }
        });

        // 4. Navigate to home
        navigate("/", { replace: true });

      } catch (err: any) {
        console.error("Auth Callback Error:", err);
        setError(err.message || "Authentication failed");
        
        toast.error("Authentication failed. Please try again.", {
          position: 'top-center',
        });
        
        // Wait a moment then go back to login
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center space-y-4">
        {error ? (
          <div className="text-destructive font-medium p-4 bg-destructive/10 rounded-lg max-w-md text-center">
            {error}
            <div className="mt-2 text-sm text-muted-foreground">
              Redirecting to login...
            </div>
          </div>
        ) : (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">Authenticating...</h2>
            <p className="text-muted-foreground text-sm">
              Please wait while we securely log you in.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
