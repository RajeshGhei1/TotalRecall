
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import TenantAdminRoutes from "./routes/TenantAdminRoutes";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TenantProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Super Admin Routes */}
                <Route path="/superadmin/*" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminRoutes />
                  </AuthGuard>
                } />

                {/* Tenant Admin Routes */}
                <Route path="/tenant-admin/*" element={
                  <AuthGuard>
                    <TenantAdminRoutes />
                  </AuthGuard>
                } />
              </Routes>
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
