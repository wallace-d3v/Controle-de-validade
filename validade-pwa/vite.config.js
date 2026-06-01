import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const basePath = '/Controle-de-validade/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Controle de Validade',
        short_name: 'Validade',
        description: 'PWA para controle de validade de produtos',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: basePath,
        icons: [
          {
            src: `${basePath}icons/icon-192.svg`,
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: `${basePath}icons/icon-512.svg`,
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
