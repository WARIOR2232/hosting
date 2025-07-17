import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/dashboardlayout';
import Home from './pages/home';
import Tenants from './pages/tenants';
import Investments from './pages/investments';
import Settings from './pages/settings';
import Login from './pages/login';
import PrivateRoute from './PrivateRoute';


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
          <Route path="/investments" element={<Investments />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
