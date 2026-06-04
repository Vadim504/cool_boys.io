import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase = process.env.GITHUB_ACTIONS === 'true' && repositoryName
  ? `/${repositoryName}/`
  : '/'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || githubPagesBase,
  plugins: [react()],
  base: '/cool_boys.io/',
})
