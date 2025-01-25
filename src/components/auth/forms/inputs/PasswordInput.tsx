import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const PasswordInput = ({ value, onChange, error, disabled }: PasswordInputProps) => (
  <div className="space-y-2">
    <Label
      htmlFor="password"
      className={cn(
        "text-sm font-medium flex items-center gap-2",
        error && "text-destructive"
      )}
    >
      <Lock className="w-4 h-4" />
      Password
    </Label>
    <Input
      id="password"
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(error && "border-destructive")}
      disabled={disabled}
      aria-invalid={!!error}
    />
    {error && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);