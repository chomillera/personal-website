// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // URL utama website Anda
  site: 'https://www.cho.my.id', 

  output: 'server',
  adapter: cloudflare()
});