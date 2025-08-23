// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // <-- TAMBAHKAN BARIS INI
  output: 'server',

  adapter: cloudflare()
});