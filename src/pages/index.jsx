import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Students from "./Students";
import Teachers from "./Teachers";
import Attendance from "./Attendance";
import Examinations from "./Examinations";
import Fees from "./Fees";
import Communications from "./Communications";
import Settings from "./Settings";
import Academics from "./Academics";
import People from "./People";
import Transport from "./Transport";
import Hostel from "./Hostel";
import Admissions from "./Admissions";
import Library from "./Library";
import Calendar from "./Calendar";
import ELearning from "./ELearning";
import Chatbot from "./Chatbot";
import Support from "./Support";
import HR from "./HR";
import AIImport from "./AIImport";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Students: Students,
    
    Teachers: Teachers,
    
    Attendance: Attendance,
    
    Examinations: Examinations,
    
    Fees: Fees,
    
    Communications: Communications,
    
    Settings: Settings,
    
    Academics: Academics,
    
    People: People,
    
    Transport: Transport,
    
    Hostel: Hostel,
    
    Admissions: Admissions,
    
    Library: Library,
    
    Calendar: Calendar,
    
    ELearning: ELearning,
    
    Chatbot: Chatbot,
    
    Support: Support,
    
    HR: HR,
    
    AIImport: AIImport,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    if (!isAuthenticated()) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Dashboard" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Students" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Students />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Teachers" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Teachers />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Attendance" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Attendance />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Examinations" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Examinations />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Fees" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Fees />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Communications" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Communications />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Settings" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Settings />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Academics" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Academics />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/People" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <People />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Transport" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Transport />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Hostel" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Hostel />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Admissions" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Admissions />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Library" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Library />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Calendar" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Calendar />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/ELearning" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <ELearning />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Chatbot" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Chatbot />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Support" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Support />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/HR" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <HR />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/AIImport" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <AIImport />
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}