import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in border-slate-200">
        <CardHeader className="space-y-3 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Math Mentor
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Join our community of learners and mentors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger 
                value="login" 
                className={cn(
                  "data-[state=active]:font-medium text-sm",
                  "data-[state=active]:bg-white data-[state=active]:text-slate-900",
                  "transition-all duration-200"
                )}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className={cn(
                  "data-[state=active]:font-medium text-sm",
                  "data-[state=active]:bg-white data-[state=active]:text-slate-900",
                  "transition-all duration-200"
                )}
              >
                Create Account
              </TabsTrigger>
            </TabsList>
            <TabsContent 
              value="login" 
              className={cn(
                "animate-in fade-in-50 duration-500",
                isLoading && "pointer-events-none opacity-50"
              )}
            >
              <LoginForm onLoadingChange={setIsLoading} />
            </TabsContent>
            <TabsContent 
              value="register" 
              className={cn(
                "animate-in fade-in-50 duration-500",
                isLoading && "pointer-events-none opacity-50"
              )}
            >
              <SignUpForm onLoadingChange={setIsLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;