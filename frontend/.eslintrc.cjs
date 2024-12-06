module.exports = {
	root: true,
	env: {
	  browser: true,
	  es2020: true,
	  jest: true, // Tetap aktif untuk mendukung Jest API
	  node: true,
	  "vitest/globals": true, // Mendukung global Vitest
	},
	extends: [
	  "eslint:recommended",
	  "plugin:react/recommended",
	  "plugin:react/jsx-runtime",
	  "plugin:react-hooks/recommended",
	  "plugin:vitest/recommended", // Rekomendasi linting untuk Vitest
	],
	ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"], // Tambahkan "node_modules" untuk memastikan folder ini diabaikan
	parserOptions: {
	  ecmaVersion: "latest", // Gunakan ECMAScript terbaru
	  sourceType: "module",
	},
	settings: {
	  react: {
		version: "detect", // Otomatis mendeteksi versi React
	  },
	},
	plugins: [
	  "react-refresh", // Plugin untuk mendukung Fast Refresh di React
	],
	rules: {
	  "react/prop-types": "off", // Tidak memerlukan prop-types jika menggunakan TypeScript atau hanya hooks
	  "react/no-unescaped-entities": "off", // Tidak memblok karakter HTML seperti tanda kutip
	  "react/jsx-no-target-blank": "off", // Matikan peringatan `noopener noreferrer` pada tautan eksternal
	  "react-refresh/only-export-components": [
		"warn",
		{ allowConstantExport: true }, // Izinkan ekspor konstanta untuk Fast Refresh
	  ],
	  "no-console": ["warn", { allow: ["warn", "error", "info"] }], // Hanya peringatan untuk `console.warn` dan `console.error`
	  "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Abaikan argumen yang tidak digunakan jika diawali dengan "_"
	  "vitest/no-conditional-expect": "warn", // Tambahkan aturan Vitest: larangan expect dalam kondisi
	  "vitest/expect-expect": "warn", // Pastikan setiap pengujian memiliki pernyataan expect
	},
  };
  