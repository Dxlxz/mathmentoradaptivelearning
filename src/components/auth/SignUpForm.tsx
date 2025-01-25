import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, User, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface SignUpFormProps {
  onToggleForm: () => void;
  className?: string;
}

export const SignUpForm = ({ onToggleForm, className }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [grade, setGrade] = useState<string>("");
  const [institution, setInstitution] = useState<string>("Others");
  const { toast } = useToast();

  // Password strength calculation
  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...(role === "student" ? { grade } : { institution }),
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
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

  return (
    <form onSubmit={handleSignUp} className={cn("space-y-6", className)} aria-label="Sign up form">
      <fieldset disabled={isLoading} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose your role</h2>
          <RadioGroup
            value={role}
            onValueChange={(value: "student" | "mentor") => setRole(value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className={cn(
              "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
              role === "student" ? "border-primary bg-accent/50" : "border-muted"
            )}>
              <RadioGroupItem value="student" id="student" className="sr-only" />
              <User className="w-6 h-6" />
              <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
            </div>
            <div className={cn(
              "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
              role === "mentor" ? "border-primary bg-accent/50" : "border-muted"
            )}>
              <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
              <User className="w-6 h-6" />
              <Label htmlFor="mentor" className="font-medium cursor-pointer">Mentor</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="space-y-2">
            <Label htmlFor="name">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="transition-all"
              aria-required="true"
            />
          </div>

          {role === "student" ? (
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={grade} onValueChange={setGrade} required>
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
              <Label htmlFor="institution">Institution</Label>
              <Select value={institution} onValueChange={setInstitution} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sekolah Kebangsaan Math Mentor">Sekolah Kebangsaan Math Mentor</SelectItem>
                  <SelectItem value="Tadika Universiti Malaysia Sabah">Tadika Universiti Malaysia Sabah</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Credentials</h2>
          <div className="space-y-2">
            <Label htmlFor="email">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="transition-all"
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="transition-all"
              aria-required="true"
            />
            <div className="space-y-1">
              <Progress value={passwordStrength} className={cn("h-2 transition-all", getPasswordStrengthColor(passwordStrength))} />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Password must be at least 8 characters
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-pulse">Creating account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" onClick={onToggleForm} className="p-0">
            Sign in
          </Button>
        </p>
      </fieldset>
    </form>
  );
};