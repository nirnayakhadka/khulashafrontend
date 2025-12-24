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
import NewsManagement from './admincomponents/pages/NewsManagement';
import SportsManagement from './admincomponents/pages/SportsManagement';
import SocietyManagement from './admincomponents/pages/SocietyManagement';
import LocalManagement from './admincomponents/pages/LocalManagement';
import MainManagement from './admincomponents/pages/MainManagement';
import MoreManagement from './admincomponents/pages/MoreManagement';
import Localform from './admincomponents/pages/Localform';
import Sportform from './admincomponents/pages/Sportform';
import Societyform from './admincomponents/pages/Societyform';
import Mainform from './admincomponents/pages/Mainform';
import Moreform from './admincomponents/pages/Moreform';
import Newsform from './admincomponents/pages/Newsform';
import SocietyDetail from './pages/SocietyDetail';
import LocalDetail from './pages/LocalDetail';
import SportDetail from './pages/SportDetail';
import MoreDetail from './pages/MoreDetail';
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
      <Route path="/news/:id" element={<NewsDetail />} />
                  {/* detail */}
      <Route path="/society/:id" element={<SocietyDetail />} />
      <Route path="/local/:id" element={<LocalDetail />} />
      <Route path="/sports/:id" element={<SportDetail />} />
      <Route path="more/:id" element={<MoreDetail/>} />


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
            <Route path="/admin/local/add" element={<Localform />} />
            <Route path="/admin/sports/add" element={<Sportform />} />
            <Route path="/admin/society/add" element={<Societyform />} />
            <Route path="/admin/main/add" element={<Mainform />} />
            <Route path="/admin/more/add" element={<Moreform />} />
            <Route path="/admin/news/add" element={<Newsform />} />

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