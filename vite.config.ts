import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Allow access from network (0.0.0.0)
    port: 8080,
    strictPort: false, // Try next available port if 8080 is taken
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React and React DOM
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            // Other large vendor libraries
            if (id.includes('html2canvas') || id.includes('dompurify')) {
              return 'utils-vendor';
            }
            // All other node_modules
            return 'vendor';
          }
          
          // Route-based chunks
          if (id.includes('/routes/SuperAdminRoutes') || id.includes('/pages/superadmin/')) {
            return 'superadmin';
          }
          if (id.includes('/routes/TenantAdminRoutes') || id.includes('/pages/tenant-admin/')) {
            return 'tenant-admin';
          }
          
          // Showcase components (homepage)
          if (id.includes('/components/AppsShowcase') || 
              id.includes('/components/FeaturesShowcase') || 
              id.includes('/components/IndustriesShowcase') ||
              id.includes('/components/SubscriptionPlansShowcase')) {
            return 'showcase';
          }
          
          // Feature management
          if (id.includes('/components/features/') || id.includes('/services/consolidatedFeatureLibrary')) {
            return 'features';
          }
          
          // AI services
          if (id.includes('/services/ai/')) {
            return 'ai-services';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  },
}));
