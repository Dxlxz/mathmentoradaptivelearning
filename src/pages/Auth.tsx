import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Building, Mail, User, Rocket, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [institution, setInstitution] = useState("");
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const metadata = {
        name,
        role,
        ...(role === "student" ? { grade } : { institution }),
      };

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if ((step === 2 && !name) || (step === 3 && !email)) {
      toast({
        title: "Required field",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const isStudent = role === "student";
  const bgColor = isStudent ? "bg-purple-50" : "bg-slate-50";
  const accentColor = isStudent ? "text-purple-600" : "text-slate-600";
  const buttonColor = isStudent 
    ? "bg-purple-600 hover:bg-purple-700" 
    : "bg-slate-800 hover:bg-slate-900";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent className="space-y-4">
            <CardHeader className="px-0">
              <CardTitle className={cn("text-2xl font-bold text-center", accentColor)}>
                Welcome to Math Mentor!
              </CardTitle>
              <CardDescription className="text-center">
                Let's get started! Are you a student or a mentor?
              </CardDescription>
            </CardHeader>
            <RadioGroup
              value={role}
              onValueChange={(value: "student" | "mentor") => setRole(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className={cn(
                "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all",
                isStudent ? "border-purple-200 hover:border-purple-300" : "border-slate-200 hover:border-slate-300"
              )}>
                <RadioGroupItem value="student" id="student" className="sr-only" />
                <Rocket className={cn("w-8 h-8", isStudent ? "text-purple-500" : "text-slate-400")} />
                <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
              </div>
              <div className={cn(
                "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all",
                !isStudent ? "border-slate-200 hover:border-slate-300" : "border-purple-200 hover:border-purple-300"
              )}>
                <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
                <Shield className={cn("w-8 h-8", !isStudent ? "text-slate-600" : "text-slate-400")} />
                <Label htmlFor="mentor" className="font-medium cursor-pointer">Mentor</Label>
              </div>
            </RadioGroup>
          </CardContent>
        );
      case 2:
        return (
          <CardContent className="space-y-4">
            <CardHeader className="px-0">
              <CardTitle className={cn("text-2xl font-bold", accentColor)}>
                {isStudent ? "Tell us about yourself!" : "Professional Details"}
              </CardTitle>
              <CardDescription>
                {isStudent ? "What should we call you?" : "Let's get your teaching profile set up"}
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={accentColor}>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full name
                  </span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={cn(
                    "transition-all duration-300",
                    isStudent ? "focus:ring-purple-500" : "focus:ring-slate-500"
                  )}
                  placeholder={isStudent ? "Your name" : "Professional name"}
                />
              </div>
              {isStudent ? (
                <div className="space-y-2">
                  <Label htmlFor="grade" className={accentColor}>
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Grade
                    </span>
                  </Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K1">K1</SelectItem>
                      <SelectItem value="G2">Grade 2</SelectItem>
                      <SelectItem value="G3">Grade 3</SelectItem>
                      <SelectItem value="G4">Grade 4</SelectItem>
                      <SelectItem value="G5">Grade 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="institution" className={accentColor}>
                    <span className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Institution
                    </span>
                  </Label>
                  <Input
                    id="institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-slate-500"
                    placeholder="School or organization"
                  />
                </div>
              )}
            </div>
          </CardContent>
        );
      case 3:
        return (
          <CardContent className="space-y-4">
            <CardHeader className="px-0">
              <CardTitle className={cn("text-2xl font-bold", accentColor)}>
                Almost there!
              </CardTitle>
              <CardDescription>
                Enter your email to receive a magic link for signing in
              </CardDescription>
            </CardHeader>
            <div className="space-y-2">
              <Label htmlFor="email" className={accentColor}>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email address
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "transition-all duration-300",
                  isStudent ? "focus:ring-purple-500" : "focus:ring-slate-500"
                )}
                placeholder="your@email.com"
              />
            </div>
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center transition-colors duration-500", bgColor)}>
      <Card className={cn(
        "w-full max-w-md animate-fade-in shadow-lg",
        isStudent ? "border-purple-100" : "border-slate-200"
      )}>
        <form onSubmit={handleSignIn} className="relative">
          {renderStep()}
          <CardFooter className="flex justify-between mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className={cn(
                  "transition-colors",
                  isStudent ? "hover:bg-purple-50" : "hover:bg-slate-50"
                )}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                className={cn(
                  "ml-auto transition-colors",
                  buttonColor
                )}
                onClick={nextStep}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className={cn(
                  "ml-auto transition-colors",
                  buttonColor
                )}
                disabled={isLoading}
              >
                {isLoading ? "Sending magic link..." : "Get Magic Link"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;