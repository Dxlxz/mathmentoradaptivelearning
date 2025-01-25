import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GradeLevel } from "@/lib/auth/types";

interface GradeSelectorProps {
  value?: GradeLevel;
  onChange: (value: GradeLevel) => void;
  error?: string;
  disabled?: boolean;
}

export const GradeSelector = ({ value, onChange, error, disabled }: GradeSelectorProps) => (
  <div className="space-y-2">
    <Label htmlFor="grade" className={cn("text-sm font-medium", error && "text-destructive")}>
      Grade Level
    </Label>
    <Select
      value={value}
      onValueChange={(value: GradeLevel) => onChange(value)}
      disabled={disabled}
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
    {error && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);