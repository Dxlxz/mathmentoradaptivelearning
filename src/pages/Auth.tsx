import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [institution, setInstitution] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const metadata = {
        name,
        role,
        ...(role === "student" ? { grade } : { institution }),
      };

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Welcome to Math Mentor</h2>
          <p className="mt-2 text-slate-600">Sign in or create an account</p>
        </div>

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>I am a...</Label>
              <RadioGroup
                value={role}
                onValueChange={(value: "student" | "mentor") => setRole(value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentor" id="mentor" />
                  <Label htmlFor="mentor">Mentor</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {role === "student" ? (
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={grade} onValueChange={setGrade} required>
                  <SelectTrigger className="mt-1">
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
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending magic link..." : "Continue with Email"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;