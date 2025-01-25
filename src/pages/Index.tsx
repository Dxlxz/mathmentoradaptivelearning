import { useAuth } from "@/components/auth/AuthContext";

const Index = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold">Welcome, {profile?.name}!</h1>
    </div>
  );
};

export default Index;