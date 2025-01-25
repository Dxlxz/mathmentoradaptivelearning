import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSignUp ? (
            <SignUpForm
              onToggleForm={() => setIsSignUp(false)}
              className="animate-in fade-in-50"
            />
          ) : (
            <LoginForm
              onToggleForm={() => setIsSignUp(true)}
              className="animate-in fade-in-50"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;