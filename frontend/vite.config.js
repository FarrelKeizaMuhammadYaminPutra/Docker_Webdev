import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Definisikan konfigurasi untuk Vite
export default defineConfig({
  plugins: [react()],
  logLevel: 'info', // Gunakan 'info' untuk output log ringan; ubah ke 'debug' untuk debugging mendalam
  server: {
    open: true, // Otomatis membuka browser saat server lokal dijalankan
    port: 5173, // Port default Vite
  },
  test: {
    environment: 'jsdom', // Menggunakan jsdom untuk simulasi DOM
    globals: true,        // Menyediakan global seperti `describe`, `it`, dan `expect`
    setupFiles: './src/test/setup.js', // Memuat file setup (e.g., konfigurasi fetch atau mocking global)
    css: true, // Izinkan CSS diproses selama pengujian
    coverage: {
      reporter: ['text', 'json', 'html'], // Tambahkan laporan cakupan kode
      exclude: ['node_modules/', 'dist/', 'src/test/'], // Kecualikan direktori tertentu
    },
  },
});
