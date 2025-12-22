import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Main from './pages/Main';
import News from './pages/News';
import Society from './pages/Society';
import Local from './pages/Local';
import More from './pages/More';
import Sports from './pages/Sports';

// Auth & Protected Routes
import Login from './admincomponents/components/Login';
import ProtectedRoute from './admincomponents/components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './admincomponents/pages/Dashboard';
import NewsManagement from './admincomponents/pages/NewsManagement';
import SportsManagement from './admincomponents/pages/SportsManagement';
import SocietyManagement from './admincomponents/pages/SocietyManagement';
import LocalManagement from './admincomponents/pages/LocalManagement';
import MainManagement from './admincomponents/pages/MainManagement';
import MoreManagement from './admincomponents/pages/MoreManagement';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - with Nav/MiniNav/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/news" element={<News />} />
          <Route path="/society" element={<Society />} />
          <Route path="/local" element={<Local />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/more" element={<More />} />
        </Route>

        {/* Login Routes - No Nav/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes - with AdminNav */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/news/*" element={<NewsManagement />} />
            <Route path="/admin/sports/*" element={<SportsManagement />} />
            <Route path="/admin/society/*" element={<SocietyManagement />} />
            <Route path="/admin/local/*" element={<LocalManagement />} />
            <Route path="/admin/main/*" element={<MainManagement />} />
            <Route path="/admin/more/*" element={<MoreManagement />} />
          </Route>
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;