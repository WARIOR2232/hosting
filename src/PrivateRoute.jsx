// src/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function PrivateRoute({ children, requiredRole }) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const snap = await getDoc(doc(db, "Users", user.uid)); // ✅ huruf besar 'Users'
        setRole(snap.exists() ? snap.data().role : "user");
      }
      setCheckingRole(false);
    };
    fetchRole();
  }, [user]);

  if (loading || checkingRole) return <p className="p-6">Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  if (requiredRole && role !== requiredRole) {
  return <Navigate to="/AccessDenied" replace />;
}

  return children;
}
