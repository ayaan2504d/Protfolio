import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createContactHandler } from "./server/contact.js";

const SMTP_ENV_KEYS = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "ADMIN_EMAIL"];

function contactApiPlugin() {
  const handler = createContactHandler();
  return {
    name: "contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", (request, response, next) => {
        handler(request, response).catch(next);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of SMTP_ENV_KEYS) {
    if (env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), contactApiPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/node_modules/three/")) return "three";
            if (id.includes("/node_modules/@react-three/")) return "react-three";
          },
        },
      },
    },
  };
});
