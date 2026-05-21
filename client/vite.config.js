import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: false, filename: 'stats.html' }), // Generate stats.html to analyze bundle sizes
  ],
  server: {
    host: true, // Allow connections from other devices on local Wi-Fi
    https: false, // Reverting to HTTP for login compatibility
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          'vendor-editor': ['@monaco-editor/react'],
          'vendor-charts': ['recharts'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable'],
          'vendor-motion': ['framer-motion']
        }
      }
    }
  }
})
