import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "") || 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "") || 5173,
    allowedHosts: ["github-explorer-yteb.onrender.com"], // ✅ Added your actual Render domain
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
