
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Tenants from "./pages/admin/Tenants";
import Users from "./pages/admin/Users";
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
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes with Authentication Guard */}
            <Route
              path="/admin/dashboard"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/admin/tenants"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Tenants />
                </AuthGuard>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Users />
                </AuthGuard>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
