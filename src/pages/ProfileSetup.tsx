import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileCompletion } from "@/components/auth/ProfileCompletion";

const ProfileSetup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileCompletion />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;