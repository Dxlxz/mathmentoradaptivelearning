import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type GradeLevel = Database["public"]["Enums"]["grade_level"];
type Institution = Database["public"]["Enums"]["institution_type"];
type AppRole = Database["public"]["Enums"]["app_role"];

interface SignUpFormProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SignUpForm = ({ onLoadingChange }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student" as AppRole,
    grade: "" as GradeLevel | "",
    institution: "" as Institution | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (!formData.name) newErrors.name = "Name is required";
    
    if (formData.role === "student" && !formData.grade) {
      newErrors.grade = "Grade is required for students";
    }
    
    if (formData.role === "mentor" && !formData.institution) {
      newErrors.institution = "Institution is required for mentors";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            ...(formData.role === "student" && { grade: formData.grade }),
            ...(formData.role === "mentor" && { institution: formData.institution }),
          },
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className={cn("flex items-center gap-2", errors.email && "text-destructive")}>
          <Mail className="w-4 h-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={cn(errors.email && "border-destructive")}
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
        <Label htmlFor="name" className={cn("flex items-center gap-2", errors.name && "text-destructive")}>
          <User className="w-4 h-4" />
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={cn(errors.name && "border-destructive")}
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
        <Label htmlFor="password" className={cn("flex items-center gap-2", errors.password && "text-destructive")}>
          <Lock className="w-4 h-4" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className={cn(errors.password && "border-destructive")}
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

      <div className="space-y-4">
        <Label className="text-sm font-medium">Role</Label>
        <RadioGroup
          value={formData.role}
          onValueChange={(value: AppRole) => handleInputChange("role", value)}
          className="grid grid-cols-2 gap-4"
        >
          <div className={cn(
            "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
            formData.role === "student" ? "border-primary bg-accent/50" : "border-muted"
          )}>
            <RadioGroupItem value="student" id="student" className="sr-only" />
            <User className="w-6 h-6" />
            <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
          </div>
          <div className={cn(
            "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
            formData.role === "mentor" ? "border-primary bg-accent/50" : "border-muted"
          )}>
            <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
            <User className="w-6 h-6" />
            <Label htmlFor="mentor" className="font-medium cursor-pointer">Mentor</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.role === "student" && (
        <div className="space-y-2">
          <Label htmlFor="grade" className={cn("text-sm font-medium", errors.grade && "text-destructive")}>
            Grade Level
          </Label>
          <Select
            value={formData.grade}
            onValueChange={(value: GradeLevel) => handleInputChange("grade", value)}
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

      {formData.role === "mentor" && (
        <div className="space-y-2">
          <Label htmlFor="institution" className={cn("text-sm font-medium", errors.institution && "text-destructive")}>
            Institution
          </Label>
          <Select
            value={formData.institution}
            onValueChange={(value: Institution) => handleInputChange("institution", value)}
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