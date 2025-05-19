
import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";

const PublicRoutes = () => {
  return (
    <>
      {/* Home Route */}
      <Route path="/" element={<Index />} />
      
      {/* Auth Route */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Pricing Page */}
      <Route path="/pricing" element={<Pricing />} />
    </>
  );
};

export default PublicRoutes;
