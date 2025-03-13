import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.fine.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});