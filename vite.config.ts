import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Allow Next-style env variable names as required by the spec
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
