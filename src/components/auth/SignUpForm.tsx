import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface SignUpFormProps {
  onToggleForm: () => void;
  className?: string;
}

export const SignUpForm = ({ onToggleForm, className }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    }
  };

  return (
    <form onSubmit={handleSignUp} className={cn("space-y-6", className)} aria-label="Sign up form">
      <fieldset disabled={isLoading} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Create Your Account</h2>
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