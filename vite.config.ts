import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { join, resolve } from 'path'
import { loadEnv, defineConfig } from 'vite'

type TEnvMode = 'dev' | 'prod'

interface IEnvs {
  H_SERVER_PORT: number
  H_SERVER_HOST: string
}

export default defineConfig((conf) => {
  const root = resolve(__dirname)
  const mode = conf.mode as TEnvMode
  const envs = loadEnv(
    mode,
    join(root, '/env/'),
    'H_'
  ) as unknown as IEnvs

  return {
    server: {
      port: envs.H_SERVER_PORT,
      host: envs.H_SERVER_HOST,
    },
    resolve: {
      alias: {
        '~': join(root, '/src'),
        '@': join(root, '/src')
      }
    },
    plugins: [
      vue(),
      tsconfigPaths({
        loose: true,
        root: root,
      })
    ],
  }
})
