import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [institution, setInstitution] = useState("");
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
    <form onSubmit={handleSignUp} className={cn("space-y-4", className)}>
      <RadioGroup
        value={role}
        onValueChange={(value: "student" | "mentor") => setRole(value)}
        className="grid grid-cols-2 gap-4"
      >
        <div className={cn(
          "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all",
          role === "student" ? "border-primary" : "border-muted"
        )}>
          <RadioGroupItem value="student" id="student" className="sr-only" />
          <User className="w-6 h-6" />
          <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
        </div>
        <div className={cn(
          "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all",
          role === "mentor" ? "border-primary" : "border-muted"
        )}>
          <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
          <User className="w-6 h-6" />
          <Label htmlFor="mentor" className="font-medium cursor-pointer">Mentor</Label>
        </div>
      </RadioGroup>

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
        />
      </div>

      {role === "student" ? (
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
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
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
            placeholder="School or organization"
          />
        </div>
      )}

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
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Button variant="link" onClick={onToggleForm} className="p-0">
          Sign in
        </Button>
      </p>
    </form>
  );
};