import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateAuthForm } from "@/lib/auth/validation";
import type { AuthFormState, AuthFormErrors } from "@/lib/auth/types";
import { EmailInput } from "./inputs/EmailInput";
import { PasswordInput } from "./inputs/PasswordInput";
import { NameInput } from "./inputs/NameInput";
import { RoleSelector } from "./selectors/RoleSelector";
import { GradeSelector } from "./selectors/GradeSelector";
import { InstitutionSelector } from "./selectors/InstitutionSelector";

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
      <EmailInput
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        error={errors.email}
        disabled={isLoading}
      />

      {type === "signup" && (
        <NameInput
          value={formData.name}
          onChange={(value) => handleInputChange("name", value)}
          error={errors.name}
          disabled={isLoading}
        />
      )}

      <PasswordInput
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        error={errors.password}
        disabled={isLoading}
      />

      {type === "signup" && (
        <>
          <RoleSelector
            value={formData.role}
            onChange={(value) => handleInputChange("role", value)}
            disabled={isLoading}
          />

          {formData.role === "student" && (
            <GradeSelector
              value={formData.grade}
              onChange={(value) => handleInputChange("grade", value)}
              error={errors.grade}
              disabled={isLoading}
            />
          )}

          {formData.role === "mentor" && (
            <InstitutionSelector
              value={formData.institution}
              onChange={(value) => handleInputChange("institution", value)}
              error={errors.institution}
              disabled={isLoading}
            />
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