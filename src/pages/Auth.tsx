import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Building, Mail, User } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [institution, setInstitution] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const bgColor = role === "student" ? "bg-purple-50" : "bg-slate-50";
  const cardBg = role === "student" ? "bg-white" : "bg-white";
  const accentColor = role === "student" ? "text-purple-600" : "text-slate-600";
  const buttonColor = role === "student" 
    ? "bg-purple-600 hover:bg-purple-700" 
    : "bg-slate-800 hover:bg-slate-900";

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor} transition-colors duration-500`}>
      <div className={`w-full max-w-md space-y-8 p-8 ${cardBg} rounded-xl shadow-lg transition-all duration-500 animate-fade-in`}>
        <div className="text-center space-y-2">
          <h2 className={`text-3xl font-bold ${accentColor} transition-colors duration-500`}>
            Welcome to Math Mentor
          </h2>
          <p className="text-slate-600">Sign in or create an account</p>
        </div>

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className={accentColor}>I am a...</Label>
              <RadioGroup
                value={role}
                onValueChange={(value: "student" | "mentor") => setRole(value)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentor" id="mentor" />
                  <Label htmlFor="mentor" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Mentor
                  </Label>
                </div>
              </RadioGroup>
            </div>

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
                className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

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
                className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {role === "student" ? (
              <div className="space-y-2">
                <Label htmlFor="grade" className={accentColor}>Grade</Label>
                <Select value={grade} onValueChange={setGrade} required>
                  <SelectTrigger className="w-full">
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
                <Label htmlFor="institution" className={accentColor}>Institution</Label>
                <Input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-slate-500"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full ${buttonColor} text-white transition-colors duration-300`}
            disabled={isLoading}
          >
            {isLoading ? "Sending magic link..." : "Continue with Email"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;