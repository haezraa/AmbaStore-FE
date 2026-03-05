// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/Home';
import TopUp from './pages/TopUp'; 
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="topup/:id" element={<TopUp />} />
          <Route path="payment/:invoice" element={<Payment />} />

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* <Route path="transactions" element={<Transactions />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;