import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import TenantAdminRoutes from "./TenantAdminRoutes";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";

// This file is now deprecated in favor of the routing in App.tsx
// Keeping for backward compatibility but routing is handled in App.tsx
const AppRoutes = () => {
  console.warn("AppRoutes from routes/index.tsx is deprecated. Routing is now handled in App.tsx");
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect to main app */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
