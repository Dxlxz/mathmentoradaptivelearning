import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, School, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type AppRole = Database["public"]["Enums"]["app_role"];
type GradeLevel = Database["public"]["Enums"]["grade_level"];
type Institution = Database["public"]["Enums"]["institution_type"];

interface SignUpFormProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SignUpForm = ({ onLoadingChange }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("student");
  const [grade, setGrade] = useState<GradeLevel | "">("");
  const [institution, setInstitution] = useState<Institution | "">("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    grade?: string;
    institution?: string;
  }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Password must contain at least one uppercase letter";
    else if (!/[0-9]/.test(password)) newErrors.password = "Password must contain at least one number";

    if (!name) newErrors.name = "Name is required";
    else if (name.length < 2) newErrors.name = "Name must be at least 2 characters";

    if (role === "student" && !grade) {
      newErrors.grade = "Grade is required for students";
    }

    if (role === "mentor" && !institution) {
      newErrors.institution = "Institution is required for mentors";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const metadata = {
        name,
        role,
        ...(role === "student" && { grade }),
        ...(role === "mentor" && { institution })
      };

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className={cn(
            "text-sm font-medium flex items-center gap-2",
            errors.email && "text-destructive"
          )}
        >
          <Mail className="w-4 h-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          placeholder="your@email.com"
          className={cn(
            "transition-all duration-200",
            errors.email && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="name"
          className={cn(
            "text-sm font-medium flex items-center gap-2",
            errors.name && "text-destructive"
          )}
        >
          <User className="w-4 h-4" />
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          placeholder="Your name"
          className={cn(
            "transition-all duration-200",
            errors.name && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={isLoading}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className={cn(
            "text-sm font-medium flex items-center gap-2",
            errors.password && "text-destructive"
          )}
        >
          <Lock className="w-4 h-4" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          placeholder="••••••••"
          className={cn(
            "transition-all duration-200",
            errors.password && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={isLoading}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
          <School className="w-4 h-4" />
          Role
        </Label>
        <Select
          value={role}
          onValueChange={(value: AppRole) => setRole(value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="mentor">Mentor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === "student" && (
        <div className="space-y-2">
          <Label
            htmlFor="grade"
            className={cn(
              "text-sm font-medium flex items-center gap-2",
              errors.grade && "text-destructive"
            )}
          >
            Grade Level
          </Label>
          <Select
            value={grade}
            onValueChange={(value: GradeLevel) => {
              setGrade(value);
              if (errors.grade) setErrors({ ...errors, grade: undefined });
            }}
            disabled={isLoading}
          >
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
          {errors.grade && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.grade}
            </p>
          )}
        </div>
      )}

      {role === "mentor" && (
        <div className="space-y-2">
          <Label
            htmlFor="institution"
            className={cn(
              "text-sm font-medium flex items-center gap-2",
              errors.institution && "text-destructive"
            )}
          >
            Institution
          </Label>
          <Select
            value={institution}
            onValueChange={(value: Institution) => {
              setInstitution(value);
              if (errors.institution) setErrors({ ...errors, institution: undefined });
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your institution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sekolah Kebangsaan Math Mentor">
                Sekolah Kebangsaan Math Mentor
              </SelectItem>
              <SelectItem value="Tadika Universiti Malaysia Sabah">
                Tadika Universiti Malaysia Sabah
              </SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
          {errors.institution && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.institution}
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};