import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; 
import autoprefixer from 'autoprefixer'; 
import tailwindPostcss from '@tailwindcss/postcss'; 

export default defineConfig({
  plugins: [react()],
  
  css: {
    postcss: {
      plugins: [
        tailwindPostcss,
        autoprefixer
      ],
    },
  },
});