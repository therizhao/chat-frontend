import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminApp } from '@/pages/admin-app';
import AppGate from '@/components/admin/app-gate';
import { AuthProvider } from '@/lib/adminAuth';
import { StudentApp } from '@/pages/student-app';
import { StudentChat } from '@/pages/student-chat';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Student routes */}
        <Route path="/" element={<StudentApp />} />

        <Route path="/chats/:chatId" element={<StudentChat />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <AppGate>
                <AdminApp />
              </AppGate>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}
