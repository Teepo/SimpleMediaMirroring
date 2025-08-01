import { defineConfig } from 'vite';

import basicSsl from '@vitejs/plugin-basic-ssl';

const gitRepoName = 'SimpleMediaMirroring';

export default defineConfig(({ mode }) => ({
    base: mode === 'production' ? `/${gitRepoName}/` : '/',
    build: {
        assetsInlineLimit: 0,
    },
    plugins: [basicSsl()],
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
            '.scss',
        ],
    },
    define: { 'process.env': {} },
    server: {
        port: 3000,
        watch: {
            usePolling: true
        }
    },
}));