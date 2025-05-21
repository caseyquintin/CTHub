import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import ContainersPage from './pages/ContainersPage';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

function App() {
  return (
    <AppProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Layout>
          <Routes>
            <Route path="/containers" element={<ContainersPage />} />
            <Route path="/" element={<Navigate to="/containers" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;