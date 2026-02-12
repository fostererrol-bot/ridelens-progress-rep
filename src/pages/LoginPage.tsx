import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import logo from "@/assets/ridelens-logo.png";

export default function LoginPage() {
  const { session, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      console.error("Sign-in error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <img src={logo} alt="RideLens" className="h-16 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to RideLens</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to track your Zwift progress
          </p>
        </div>
        <Button
          onClick={handleGoogleSignIn}
          size="lg"
          className="w-full"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
