import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import deno from '@deno/vite-plugin'
import { resolve } from 'jsr:@std/path'

export default defineConfig({
	envDir: '../../',
	plugins: [TanStackRouterVite(), react(), deno()],
	resolve: {
		alias: {
			'@': resolve(import.meta.dirname!, './src'),
		},
	},
})
