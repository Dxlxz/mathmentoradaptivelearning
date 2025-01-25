import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Institution } from "@/lib/auth/types";

interface InstitutionSelectorProps {
  value?: Institution;
  onChange: (value: Institution) => void;
  error?: string;
  disabled?: boolean;
}

export const InstitutionSelector = ({ value, onChange, error, disabled }: InstitutionSelectorProps) => (
  <div className="space-y-2">
    <Label htmlFor="institution" className={cn("text-sm font-medium", error && "text-destructive")}>
      Institution
    </Label>
    <Select
      value={value}
      onValueChange={(value: Institution) => onChange(value)}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select your institution" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Sekolah Kebangsaan Math Mentor">
          Sekolah Kebangsaan Math Mentor
        </SelectItem>
        <SelectItem value="Tadika Universiti Malaysia Sabah">
          Tadika Universiti Malaysia Sabah
        </SelectItem>
        <SelectItem value="Others">Others</SelectItem>
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