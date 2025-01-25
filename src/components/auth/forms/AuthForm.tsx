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
import { validateAuthForm } from "@/lib/auth/validation";
import type { AuthFormState, AuthFormErrors, AppRole, GradeLevel, Institution } from "@/lib/auth/types";

interface AuthFormProps {
  type: "login" | "signup";
  onLoadingChange?: (isLoading: boolean) => void;
  onForgotPassword?: () => void;
}

export const AuthForm = ({ type, onLoadingChange, onForgotPassword }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormState>({
    email: "",
    password: "",
    name: "",
    role: "student",
    grade: undefined,
    institution: undefined,
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const { toast } = useToast();

  const handleInputChange = (field: keyof AuthFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAuthForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
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
      }

      toast({
        title: type === "login" ? "Welcome back!" : "Success!",
        description: type === "login" 
          ? "You have successfully signed in."
          : "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error(`${type} error:`, error);
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
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {type === "signup" && (
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
      )}

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

      {type === "signup" && (
        <>
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
        </>
      )}

      {type === "login" && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className="text-sm px-0 font-medium text-slate-600 hover:text-slate-900"
            disabled={isLoading}
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
      )}

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {type === "login" ? "Signing in..." : "Creating account..."}
          </span>
        ) : (
          type === "login" ? "Sign In" : "Create Account"
        )}
      </Button>
    </form>
  );
};