import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SignUpForm = ({ onLoadingChange }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (calculatePasswordStrength(password) < 75) {
      newErrors.password = "Password does not meet all requirements";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
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
            name: email.split('@')[0], // Default name from email
            role: 'student', // Default role
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please complete your profile to continue.",
      });
      
      navigate("/profile-setup");
    } catch (error: any) {
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
    <form onSubmit={handleSignUp} className="space-y-5 animate-fade-in" aria-label="Sign up form">
      <div className="space-y-2">
        <Label 
          htmlFor="signup-email" 
          className={cn(
            "text-sm font-medium flex items-center gap-2",
            errors.email && "text-destructive"
          )}
        >
          <Mail className="w-4 h-4" />
          Email
        </Label>
        <Input
          id="signup-email"
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
          htmlFor="signup-password" 
          className={cn(
            "text-sm font-medium flex items-center gap-2",
            errors.password && "text-destructive"
          )}
        >
          <Lock className="w-4 h-4" />
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          onFocus={() => setHasInteractedWithPassword(true)}
          placeholder="••••••••"
          className={cn(
            "transition-all duration-200",
            hasInteractedWithPassword && calculatePasswordStrength(password) < 75 && "border-orange-500 focus-visible:ring-orange-500",
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
        {hasInteractedWithPassword && (
          <div className="space-y-3 animate-fade-in">
            <Progress 
              value={calculatePasswordStrength(password)} 
              className={cn(
                "h-2 transition-all", 
                getPasswordStrengthColor(calculatePasswordStrength(password))
              )} 
            />
            <div className="space-y-2">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Password requirements:
              </p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li className={cn(
                  "text-slate-500",
                  password.length >= 8 && "text-green-500"
                )}>
                  At least 8 characters
                </li>
                <li className={cn(
                  "text-slate-500",
                  password.match(/[A-Z]/) && "text-green-500"
                )}>
                  One uppercase letter
                </li>
                <li className={cn(
                  "text-slate-500",
                  password.match(/[0-9]/) && "text-green-500"
                )}>
                  One number
                </li>
                <li className={cn(
                  "text-slate-500",
                  password.match(/[^A-Za-z0-9]/) && "text-green-500"
                )}>
                  One special character
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-11" 
        disabled={isLoading || (hasInteractedWithPassword && calculatePasswordStrength(password) < 75)}
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