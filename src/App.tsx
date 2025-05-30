
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import SuperAdminRoutes from "@/routes/SuperAdminRoutes";
import TenantAdminRoutes from "@/routes/TenantAdminRoutes";
import AuthGuard from "@/components/AuthGuard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { FormProvider } from "@/contexts/FormContext";
import ConditionalFormModal from "@/components/forms/integration/ConditionalFormModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('JWT')) return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TenantProvider>
              <FormProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Protected Super Admin Routes */}
                  <Route path="/superadmin/*" element={
                    <AuthGuard requiresSuperAdmin>
                      <SuperAdminRoutes />
                    </AuthGuard>
                  } />
                  
                  {/* Protected Tenant Admin Routes */}
                  <Route path="/tenant-admin/*" element={
                    <AuthGuard>
                      <TenantAdminRoutes />
                    </AuthGuard>
                  } />
                  
                  {/* Legacy Route Redirects */}
                  <Route path="/admin/*" element={<Navigate to="/superadmin/dashboard" replace />} />
                  <Route path="/dashboard" element={<Navigate to="/tenant-admin/dashboard" replace />} />
                  
                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ConditionalFormModal />
              </FormProvider>
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
