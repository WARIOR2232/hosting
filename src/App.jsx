import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/dashboardlayout';
import Home from './pages/home';
import Tenants from './pages/tenants';
import Investments from './pages/NotificationPage';
import Settings from './pages/settings';
import Login from './pages/login';
import PrivateRoute from './PrivateRoute';
import TambahData from './pages/TambahData';
import Notifikasi from './pages/NotificationPage';



function App() {
  const [count, setCount] = useState(0)

  return (
       <BrowserRouter basename='/hosting'>
      <Routes>
        {/* Halaman login tanpa sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Semua halaman dashboard diproteksi */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/NotificationPage" element={<Notifikasi />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/TambahData" element={<TambahData />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
