import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';
import WindiCSS from 'vite-plugin-windicss';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    port: parseInt(process.env.PORT!) || 8889,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PROXY_PORT}/api`,
        // changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#13c2c2' },
      },
      // ....
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    vitePluginImp({
      libList: [
        // {
        //   libName: 'antd',
        //   style: name => `antd/es/${name}/style/index.css`,
        // },
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
      ],
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    WindiCSS(),
  ],
});
