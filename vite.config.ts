import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];
  try {
    // @ts-expect-error optional plugin file, not present in this repo
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {
    // optional plugin file not present in this repo — safe to skip
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    build: {
      // Vite's default modulePreload injects a <link rel="modulepreload">
      // for every chunk reachable from the entry — including the ~20
      // below-fold sections that LazyMount deliberately defers until
      // scrolled near. That made the browser fetch and parse all of them
      // during the initial load anyway, fighting the Hero-critical path
      // for network and main-thread time for no benefit (nothing needs
      // them yet). Disabling it lets those chunks load lazily, via their
      // own dynamic import(), only once actually mounted.
      modulePreload: false,
    },
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
    },
  };
})
