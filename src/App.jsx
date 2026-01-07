import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components 
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Main from './pages/Main';
import NewsDetail from './pages/NewsDetail';
import CategoryPage from './pages/CategoryPage'; // NEW: Single dynamic category page

// Legacy category pages (optional - keep for backward compatibility or remove)
import News from './pages/News';
import Society from './pages/Society';
import Local from './pages/Local';
import More from './pages/More';
import Sports from './pages/Sports';

// Detail pages (now also dynamic)
import SocietyDetail from './pages/SocietyDetail';
import LocalDetail from './pages/LocalDetail';
import SportDetail from './pages/SportDetail';
import MoreDetail from './pages/MoreDetail';
import MainDetail from './pages/MainDetail';

// Auth & Protected routes
import Login from './admincomponents/components/Login';
import ProtectedRoute from './admincomponents/components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './admincomponents/pages/Dashboard';
import LocalManagement from './admincomponents/pages/LocalManagement';
import UnifiedNewsForm from './admincomponents/pages/Localform';
import Category from './admincomponents/pages/Category';
import Setting from './admincomponents/pages/Setting';  
import Authors from './admincomponents/pages/Author';
import FooterSettings from './admincomponents/pages/Fotersetting';
import Ourteam from './pages/Ourteam';
import Ourteamsetting from './admincomponents/pages/Ourteamsetting';
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - with Nav/MiniNav/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Main />} />
          
          {/* NEW: Dynamic category routes - ANY category will work! */}
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/:id" element={<NewsDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/society" element={<Society />} />
          <Route path="/local" element={<Local />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/more" element={<More />} />
          <Route path="/ourteam" element={<Ourteam />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/society/:id" element={<SocietyDetail />} />
          <Route path="/local/:id" element={<LocalDetail />} />
          <Route path="/sports/:id" element={<SportDetail />} />
          <Route path="/more/:id" element={<MoreDetail />} />
          
          
          <Route path="/main/:id" element={<MainDetail />} />
        </Route>

        {/* Login Routes - No Nav/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes - with AdminNav */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/local/*" element={<LocalManagement />} />
            <Route path="/admin/local/add" element={<UnifiedNewsForm />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/settings" element={<Setting />} />
            <Route path="/admin/author" element={<Authors />} />
            <Route path="/admin/ourteamsetting" element={<Ourteamsetting />} />
            <Route path="/admin/footer-settings" element={<FooterSettings />} />
          </Route>
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;