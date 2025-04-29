
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ClubsPage from "./pages/ClubsPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ClubDetailsPage from "./pages/ClubDetailsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/clubs" element={
                  <ProtectedRoute>
                    <ClubsPage />
                  </ProtectedRoute>
                } />
                <Route path="/clubs/:clubId" element={
                  <ProtectedRoute>
                    <ClubDetailsPage />
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <EventsPage />
                  </ProtectedRoute>
                } />
                <Route path="/events/:eventId" element={
                  <ProtectedRoute>
                    <EventDetailsPage />
                  </ProtectedRoute>
                } />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/organizer-dashboard" element={
                  <ProtectedRoute>
                    <OrganizerDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
