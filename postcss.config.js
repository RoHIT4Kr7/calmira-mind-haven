export default {
  plugins: {
    "postcss-import": {},
    tailwindcss: { config: "./tailwind.config.ts" },
    "postcss-preset-env": { stage: 3, preserve: true },
  },
};
