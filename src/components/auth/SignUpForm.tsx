import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SignUpForm = ({ onLoadingChange }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0],
            role: 'student',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/profile-setup");
    } catch (error) {
      // Only log critical errors that affect user experience
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
    <form onSubmit={handleSignUp} className="space-y-5 animate-fade-in">
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
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
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
          aria-invalid={!!errors.password}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label 
          htmlFor="confirm-password" 
          className={cn(
            "text-sm font-medium flex items-center gap-2",
            errors.confirmPassword && "text-destructive"
          )}
        >
          <Lock className="w-4 h-4" />
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
          }}
          placeholder="••••••••"
          className={cn(
            "transition-all duration-200",
            errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
          )}
          aria-invalid={!!errors.confirmPassword}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-11" 
        disabled={isLoading}
      >
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