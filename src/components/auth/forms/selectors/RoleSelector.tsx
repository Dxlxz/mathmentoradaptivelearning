import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/lib/auth/types";

interface RoleSelectorProps {
  value: AppRole;
  onChange: (value: AppRole) => void;
  disabled?: boolean;
}

export const RoleSelector = ({ value, onChange, disabled }: RoleSelectorProps) => (
  <div className="space-y-4">
    <Label className="text-sm font-medium">Role</Label>
    <RadioGroup
      value={value}
      onValueChange={(value: AppRole) => onChange(value)}
      className="grid grid-cols-2 gap-4"
      disabled={disabled}
    >
      <div className={cn(
        "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
        value === "student" ? "border-primary bg-accent/50" : "border-muted"
      )}>
        <RadioGroupItem value="student" id="student" className="sr-only" />
        <User className="w-6 h-6" />
        <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
      </div>
      <div className={cn(
        "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
        value === "mentor" ? "border-primary bg-accent/50" : "border-muted"
      )}>
        <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
        <User className="w-6 h-6" />
        <Label htmlFor="mentor" className="font-medium cursor-pointer">Mentor</Label>
      </div>
    </RadioGroup>
  </div>
);