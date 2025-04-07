import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthRequired } from './components/AuthRequired';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              element={
                <AuthRequired>
                  <div className="min-h-screen bg-gray-50 flex">
                    <Navbar />
                    <MainContent />
                  </div>
                </AuthRequired>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Routes>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

function MainContent() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default App;