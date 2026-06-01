import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import React from 'react'

export default defineConfig({
    base:'/controle-de-estoque/',
    plugins:[
        React(),
        VitePWA({
            registerType:'autoUpdate',
            manifest:{
                name:'Controle de validade',
                short_name:'Validade',
                description:'PWA para controle de estoque e produtos',
                theme_color:'#111827',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/validade-pwa/',
                icons:[{
                    src: '/validade-pwa/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/validade-pwa/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
            }
        })
    ]
})