import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SkiFun Japan Industrial Demo',
        short_name: 'SkiFun Demo',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'assets/branding_icons_3d_1776435265195.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        landing: 'portal-student/landing.html',
        booking: 'portal-student/booking.html',
        mobile: 'portal-coach/mobile.html',
        dashboard: 'portal-admin/dashboard.html'
      }
    }
  }
});
