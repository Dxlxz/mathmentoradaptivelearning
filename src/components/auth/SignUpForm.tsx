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
  const { toast } = useToast();
  const navigate = useNavigate();

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
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please complete your profile to continue.",
      });
      
      navigate("/profile-setup");
    } catch (error) {
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

  const handlePasswordFocus = () => {
    setHasInteractedWithPassword(true);
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <form onSubmit={handleSignUp} className="space-y-4 animate-fade-in" aria-label="Sign up form">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
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
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
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
          onFocus={handlePasswordFocus}
          required
          placeholder="••••••••"
          className={cn(
            "transition-all",
            hasInteractedWithPassword && passwordStrength < 75 && "border-orange-500 focus-visible:ring-orange-500"
          )}
          aria-required="true"
          disabled={isLoading}
        />
        {hasInteractedWithPassword && (
          <div className="space-y-2 animate-fade-in">
            <Progress 
              value={passwordStrength} 
              className={cn(
                "h-2 transition-all", 
                getPasswordStrengthColor(passwordStrength)
              )} 
            />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Password requirements:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li className={cn(password.length >= 8 && "text-green-500")}>
                  At least 8 characters
                </li>
                <li className={cn(password.match(/[A-Z]/) && "text-green-500")}>
                  One uppercase letter
                </li>
                <li className={cn(password.match(/[0-9]/) && "text-green-500")}>
                  One number
                </li>
                <li className={cn(password.match(/[^A-Za-z0-9]/) && "text-green-500")}>
                  One special character
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || (hasInteractedWithPassword && passwordStrength < 75)}
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