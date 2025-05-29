
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import PublicRoutes from "@/routes/PublicRoutes";
import SuperAdminRoutes from "@/routes/SuperAdminRoutes";
import TenantAdminRoutes from "@/routes/TenantAdminRoutes";
import AuthGuard from "@/components/AuthGuard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { FormProvider } from "@/contexts/FormContext";
import ConditionalFormModal from "@/components/forms/integration/ConditionalFormModal";

const queryClient = new QueryClient();

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
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  {PublicRoutes()}
                  {SuperAdminRoutes()}
                  {TenantAdminRoutes()}
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
