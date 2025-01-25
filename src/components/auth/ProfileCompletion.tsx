import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type GradeLevel = Database["public"]["Enums"]["grade_level"];
type Institution = Database["public"]["Enums"]["institution_type"];
type AppRole = Database["public"]["Enums"]["app_role"];

export const ProfileCompletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("student");
  const [grade, setGrade] = useState<GradeLevel>("K1");
  const [institution, setInstitution] = useState<Institution>("Others");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProfileComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          role,
          ...(role === "student" ? { grade } : { institution }),
          profile_completed: true,
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Profile completed!",
        description: "You can now start using the application.",
      });
      
      navigate("/");
    } catch (error: any) {
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
    <form onSubmit={handleProfileComplete} className="space-y-6" aria-label="Profile completion form">
      <fieldset disabled={isLoading} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose your role</h2>
          <RadioGroup
            value={role}
            onValueChange={(value: Role) => setRole(value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className={cn(
              "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
              role === "student" ? "border-primary bg-accent/50" : "border-muted"
            )}>
              <RadioGroupItem value="student" id="student" className="sr-only" />
              <User className="w-6 h-6" />
              <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
            </div>
            <div className={cn(
              "relative flex flex-col items-center space-y-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent",
              role === "mentor" ? "border-primary bg-accent/50" : "border-muted"
            )}>
              <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
              <User className="w-6 h-6" />
              <Label htmlFor="mentor" className="font-medium cursor-pointer">Mentor</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="space-y-2">
            <Label htmlFor="name">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="transition-all"
              aria-required="true"
            />
          </div>

          {role === "student" ? (
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={grade} onValueChange={(value: GradeLevel) => setGrade(value)} required>
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
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Select value={institution} onValueChange={(value: Institution) => setInstitution(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sekolah Kebangsaan Math Mentor">Sekolah Kebangsaan Math Mentor</SelectItem>
                  <SelectItem value="Tadika Universiti Malaysia Sabah">Tadika Universiti Malaysia Sabah</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-pulse">Completing profile...</span>
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </fieldset>
    </form>
  );
};
