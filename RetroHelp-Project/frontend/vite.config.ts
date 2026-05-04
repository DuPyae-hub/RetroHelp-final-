import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          configure(proxy) {
            proxy.on('error', (err: NodeJS.ErrnoException) => {
              const code = err.code ? `${err.code} ` : ''
              console.warn(
                `\n[vite] /api proxy → ${apiProxyTarget}\n` +
                  `[vite] ${code}${err.message}\n` +
                  `[vite] Start the API: cd RetroHelp-Project/backend && php artisan serve\n` +
                  `[vite] Or set VITE_API_PROXY_TARGET in frontend/.env.development to your Laravel URL/port.\n`,
              )
            })
          },
        },
      },
    },
  }
})
