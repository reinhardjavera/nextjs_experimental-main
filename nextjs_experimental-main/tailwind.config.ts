import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Tentukan folder app untuk Next.js 13+ dengan App Directory
    './components/**/*.{js,ts,jsx,tsx}', // Jika Anda menggunakan komponen di luar folder app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;



// import type { Config } from "tailwindcss";

// export default {
//   content: [
//     // './pages/**/*.{js,ts,jsx,tsx}',   
//     // './components/**/*.{js,ts,jsx,tsx}',
//     // './app/**/*.{js,ts,jsx,tsx}', 
//     './app/**/*.{js,ts,jsx,tsx}', // Tentukan folder app untuk Next.js 13+ dengan App Directory
//     './components/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;
