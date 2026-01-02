import { Routes, Route, Navigate } from 'react-router-dom';
//  to protect crud and admin and i use and connect to frontend (axious used sequelize , database: sql , hashed pass for admin)
//  nodejs for backend jwt token is generated in backend and used in frontend
import { AuthProvider } from './context/AuthContext';
// Layout Components 
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
// Public Pages (call kalpa get api (only)
import Main from './pages/Main';
import NewsDetail from './pages/NewsDetail';
import News from './pages/News';
import Society from './pages/Society';
import Local from './pages/Local';
import More from './pages/More';
import Sports from './pages/Sports';
// Auth nd Protected  routes
import Login from './admincomponents/components/Login';
import ProtectedRoute from './admincomponents/components/ProtectedRoute';
//for my Admin Pages
import AdminDashboard from './admincomponents/pages/Dashboard';
import LocalManagement from './admincomponents/pages/LocalManagement';

import UnifiedNewsForm from './admincomponents/pages/Localform';

import SocietyDetail from './pages/SocietyDetail';
import LocalDetail from './pages/LocalDetail';
import SportDetail from './pages/SportDetail';
import MoreDetail from './pages/MoreDetail';
import MainDetail from './pages/MainDetail';
// for 3 logics in main page 


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
          <Route path="/news/:id" element={<NewsDetail />} />
                  {/* detail */}
          <Route path="/society/:id" element={<SocietyDetail />} />
          <Route path="/local/:id" element={<LocalDetail />} />
          <Route path="/sports/:id" element={<SportDetail />} />
          <Route path="/more/:id" element={<MoreDetail/>} />
          <Route path='/main/:id' element={<MainDetail/>} />



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


            {/* detail */}
            
          </Route>
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;