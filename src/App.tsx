import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Toaster } from '@/components/ui/sonner';
import About from '@/pages/About';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sobre" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
