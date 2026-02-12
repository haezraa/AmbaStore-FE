// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import TopUp from './pages/TopUp'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Home />} />
          
          <Route path="topup/:id" element={<TopUp />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;