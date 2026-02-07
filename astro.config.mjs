// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://gavin-ai-training-camp.com',
  // 如果部署到 GitHub Pages，取消下面这行注释并替换为你的仓库名
  // base: '/your-repo-name',
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});