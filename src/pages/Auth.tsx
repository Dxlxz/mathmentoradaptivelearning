import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Math Mentor
          </CardTitle>
          <CardDescription className="text-center text-base">
            Join our community of learners and mentors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="data-[state=active]:font-medium">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:font-medium">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className={cn("animate-in fade-in-50", isLoading && "pointer-events-none opacity-50")}>
              <LoginForm onLoadingChange={setIsLoading} />
            </TabsContent>
            <TabsContent value="register" className={cn("animate-in fade-in-50", isLoading && "pointer-events-none opacity-50")}>
              <SignUpForm onLoadingChange={setIsLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;