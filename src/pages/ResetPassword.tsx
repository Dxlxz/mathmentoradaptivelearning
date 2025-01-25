import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);
  const [error, setError] = useState<string>();
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

  const validateForm = () => {
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (calculatePasswordStrength(password) < 75) {
      setError("Password does not meet all requirements");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });
      
      navigate("/auth");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in border-slate-200">
        <CardHeader className="space-y-3 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  error && "text-destructive"
                )}
              >
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(undefined);
                }}
                onFocus={() => setHasInteractedWithPassword(true)}
                placeholder="••••••••"
                className={cn(
                  "transition-all duration-200",
                  hasInteractedWithPassword && calculatePasswordStrength(password) < 75 && "border-orange-500 focus-visible:ring-orange-500",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading}
              />
            </div>

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

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  error && "text-destructive"
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
                  setError(undefined);
                }}
                placeholder="••••••••"
                className={cn(
                  "transition-all duration-200",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading || (hasInteractedWithPassword && calculatePasswordStrength(password) < 75)}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating password...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;