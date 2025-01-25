import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const EmailInput = ({ value, onChange, error, disabled }: EmailInputProps) => (
  <div className="space-y-2">
    <Label
      htmlFor="email"
      className={cn(
        "text-sm font-medium flex items-center gap-2",
        error && "text-destructive"
      )}
    >
      <Mail className="w-4 h-4" />
      Email
    </Label>
    <Input
      id="email"
      type="email"
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