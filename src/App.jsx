// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/dashboardlayout";
import Home from "./pages/home";
import Tenants from "./pages/tenants";
import Settings from "./pages/settings";
import Login from "./pages/login";
import PrivateRoute from "./PrivateRoute";
import TambahData from "./pages/TambahData";
import Notifikasi from "./pages/NotificationPage";
import RPTKAPage from "./pages/Doku";

function App() {
  return (
    <BrowserRouter basename="/hosting">
      <Routes>
        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* Semua route yang butuh login */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Untuk semua user */}
          <Route path="/" element={<Home />} />
          <Route path="/tenants" element={<Tenants />} />

          {/* Hanya untuk admin */}
          <Route
            path="/NotificationPage"
            element={
              <PrivateRoute requiredRole="admin">
                <Notifikasi />
              </PrivateRoute>
            }
          />
          <Route
            path="/TambahData"
            element={
              <PrivateRoute requiredRole="admin">
                <TambahData />
              </PrivateRoute>
            }
          />

          {/* (opsional) Halaman Settings jika nanti mau dipakai */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/Doku" element={<RPTKAPage  />} />
        </Route>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
