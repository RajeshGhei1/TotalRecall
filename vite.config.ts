import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and loading performance
        manualChunks: {
          // Core React and routing
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'tailwindcss-animate',
            'lucide-react',
            'sonner',
            'vaul',
            'cmdk',
            'input-otp',
            'react-day-picker',
            'react-resizable-panels',
            'embla-carousel-react',
            'next-themes',
          ],
          
          // Form handling
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          
          // Data management
          'data-vendor': [
            '@tanstack/react-query',
            '@supabase/supabase-js',
          ],
          
          // Charts and analytics (lazy load)
          'charts-vendor': [
            'recharts',
          ],
          
          // PDF and document generation (lazy load)
          'pdf-vendor': [
            'jspdf',
            'jspdf-autotable',
          ],
          
          // File processing (lazy load)
          'file-vendor': [
            'papaparse',
            'xlsx',
          ],
          
          // Drag and drop (lazy load)
          'dnd-vendor': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities',
          ],
          
          // React Flow (lazy load)
          'flow-vendor': [
            'reactflow',
          ],
          
          // Date utilities
          'date-vendor': [
            'date-fns',
          ],
          
          // Markdown rendering (lazy load)
          'markdown-vendor': [
            'react-markdown',
          ],
        },
      },
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Enable source maps for debugging
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
    // Exclude large dependencies from pre-bundling
    exclude: [
      'jspdf',
      'jspdf-autotable',
      'recharts',
      'reactflow',
      'papaparse',
      'xlsx',
    ],
  },
}));
