import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p className="p-6">Loading...</p>;

  return user ? children : <Navigate to="/login" />;
}
