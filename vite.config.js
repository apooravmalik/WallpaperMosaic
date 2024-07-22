import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import process from 'process';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.API_URL': JSON.stringify(process.env.API_URL)
  }
})