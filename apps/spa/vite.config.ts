import { defineConfig, loadEnv as loadEnvVite } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import deno from '@deno/vite-plugin'
import { resolve } from 'jsr:@std/path'
import loadEnv from '../../envLoader.ts'

export default defineConfig(({ mode }) => {
	const envDir = '../../'
	const viteEnv = loadEnvVite(mode, envDir, '')

	const env = loadEnv(viteEnv, ['VITE_HOST', 'VITE_PORT'])

	return {
		server: {
			host: env.VITE_HOST,
			port: env.VITE_PORT,
		},
		envDir,
		plugins: [TanStackRouterVite(), react(), deno()],
		resolve: {
			alias: {
				'@': resolve(import.meta.dirname!, './src'),
			},
		},
	}
})
