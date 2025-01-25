import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const NameInput = ({ value, onChange, error, disabled }: NameInputProps) => (
  <div className="space-y-2">
    <Label
      htmlFor="name"
      className={cn(
        "text-sm font-medium flex items-center gap-2",
        error && "text-destructive"
      )}
    >
      <User className="w-4 h-4" />
      Name
    </Label>
    <Input
      id="name"
      type="text"
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