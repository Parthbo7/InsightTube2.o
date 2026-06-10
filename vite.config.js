import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { youtubeApiMiddleware, validateEnv } from './server/youtubeApi.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Assign to process.env so they are available in youtubeApiMiddleware
  process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.VITE_SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.YOUTUBE_API_KEY = env.YOUTUBE_API_KEY;

  // Validate environment variables at startup
  validateEnv();

  return {
    plugins: [
      react(),
      {
        name: 'youtube-api-middleware',
        configureServer(server) {
          server.middlewares.use(youtubeApiMiddleware);
        }
      }
    ]
  };
})
