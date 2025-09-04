import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  preview: {
    host: true,                 // escuta em 0.0.0.0
    port: process.env.PORT || 3000, // usa porta do servidor ou 3000
    allowedHosts: ['*'],        // permite qualquer host
  },
});
