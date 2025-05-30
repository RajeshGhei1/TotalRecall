import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";

const PublicRoutes = () => [
  /* Home Route */
  <Route path="/" element={<Index />} key="home" />,
  
  /* Auth Route */
  <Route path="/auth" element={<Auth />} key="auth" />,
  
  /* Pricing Page */
  <Route path="/pricing" element={<Pricing />} key="pricing" />
];

export default PublicRoutes;
