import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { GradeNavigation } from "@/components/GradeNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <GradeNavigation />
        <div className="flex-1 bg-slate-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <h1 className="text-xl font-bold">Math Mentor</h1>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Welcome, {profile?.name}!
              </h2>
              {profile?.role === "student" ? (
                <p>You are logged in as a student in grade {profile.grade}</p>
              ) : (
                <p>You are logged in as a mentor at {profile.institution}</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;