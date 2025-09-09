import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <div>Loading...</div>;
  if (user.role !== "admin") return <Navigate to="/" />;
  return <>{children}</>;
};

export default AdminRoute;