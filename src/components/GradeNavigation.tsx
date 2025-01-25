import { useAuth } from "@/components/auth/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GradeNavigation = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (profile && !profile.profile_completed) {
      navigate("/profile-setup");
    }
  }, [user, profile, navigate]);

  return null; // or any other JSX you want to render
};

export default GradeNavigation;
