import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import util from '@di-fe/di-cli/utils/preBuildUtil'
import react from '@vitejs/plugin-react'
import postCssPxToRem from 'postcss-pxtorem'

const { readFile: readCiFile } = util

let publicPath: string = './'
const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  // 只有dev或者master分支打包才会有s3前缀
  const { ossPrefix } = readCiFile()
  if (ossPrefix) publicPath = ossPrefix
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())

  return {
    base: publicPath,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/core" as *;`
        }
      },
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 39.5, // 按照设计稿宽度395px设置
            propList: ['*'], // 所有属性都转换
            selectorBlackList: ['.ignore-'], // 忽略的选择器
            minPixelValue: 2 // 小于2px的不转换
          })
        ]
      }
    },
    server: {
      port: 8888,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'di-dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'antd-mobile': ['antd-mobile'],
            'zustand': ['zustand']
          }
        }
      }
    }
  }
})