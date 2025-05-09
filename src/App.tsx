
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/superadmin/Dashboard";
import Tenants from "./pages/superadmin/Tenants";
import Users from "./pages/superadmin/Users";
import Settings from "./pages/superadmin/Settings";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Superadmin Routes with Authentication Guard */}
            <Route
              path="/superadmin/dashboard"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/tenants"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Tenants />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/users"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Users />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/settings"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Settings />
                </AuthGuard>
              }
            />
            
            {/* Redirect old admin routes to superadmin for backward compatibility */}
            <Route path="/admin/dashboard" element={<Navigate to="/superadmin/dashboard" replace />} />
            <Route path="/admin/tenants" element={<Navigate to="/superadmin/tenants" replace />} />
            <Route path="/admin/users" element={<Navigate to="/superadmin/users" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/superadmin/settings" replace />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
