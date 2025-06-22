import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Conducteur Pages
import AnnonceForm from "./conducteur/AnnonceForm";
import AnnonceList from "./conducteur/AnnonceList";
import DemandesRecues from "./conducteur/DemandesRecues";
import HistoriqueTrajets from "./conducteur/HistoriqueTrajets";

// Expediteur Pages
import RechercheAnnonces from "./expediteur/RechercheAnnonces";
import DemandeForm from "./expediteur/DemandeForm";
import HistoriqueDemandes from "./expediteur/HistoriqueDemandes";

// Admin Pages
import AdminDashboard from "./admin/Dashboard";
import UserManagement from "./admin/UserManagement";
import AnnonceManagement from "./admin/AnnonceManagement";
import Statistics from "./admin/Statistics";

// Evaluation Pages
import EvaluationForm from "./evaluations/EvaluationForm";
import EvaluationDisplay from "./evaluations/EvaluationDisplay";

// Chat Pages
import Chat from "./pages/Chat";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Header />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Conducteur Routes */}
              <Route 
                path="/conducteur/annonces" 
                element={
                  <ProtectedRoute allowedRoles={['conducteur']}>
                    <AnnonceList />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/conducteur/annonces/create" 
                element={
                  <ProtectedRoute allowedRoles={['conducteur']}>
                    <AnnonceForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/conducteur/annonces/edit/:id" 
                element={
                  <ProtectedRoute allowedRoles={['conducteur']}>
                    <AnnonceForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/conducteur/demandes" 
                element={
                  <ProtectedRoute allowedRoles={['conducteur']}>
                    <DemandesRecues />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/conducteur/historique" 
                element={
                  <ProtectedRoute allowedRoles={['conducteur']}>
                    <HistoriqueTrajets />
                  </ProtectedRoute>
                } 
              />

              {/* Expediteur Routes */}
              <Route 
                path="/expediteur/recherche" 
                element={
                  <ProtectedRoute allowedRoles={['expediteur']}>
                    <RechercheAnnonces />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/expediteur/demandes" 
                element={
                  <ProtectedRoute allowedRoles={['expediteur']}>
                    <HistoriqueDemandes />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/expediteur/demande/:annonceId" 
                element={
                  <ProtectedRoute allowedRoles={['expediteur']}>
                    <DemandeForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/expediteur/historique" 
                element={
                  <ProtectedRoute allowedRoles={['expediteur']}>
                    <HistoriqueDemandes />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/annonces" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AnnonceManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/stats" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Statistics />
                  </ProtectedRoute>
                } 
              />

              {/* Evaluation Routes */}
              <Route 
                path="/evaluations/create/:demandeId" 
                element={
                  <ProtectedRoute>
                    <EvaluationForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/evaluations/user/:userId" 
                element={<EvaluationDisplay />} 
              />

              {/* Chat Routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
