import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project under /Clarinkieinbiz/, so the build
// needs that base path. The Pages workflow sets GITHUB_PAGES=true; every
// other context (local dev, Vercel, Netlify — all served at the domain
// root) keeps base '/'.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Clarinkieinbiz/' : '/',
  plugins: [react()],
})
