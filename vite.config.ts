import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@mantine/core", "@mantine/hooks", "@tabler/icons-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mantine")) return "mantine";
            if (id.includes("@tabler/icons-react")) return "tabler-icons";
            return "vendor";
          }
        },
      },
    },
  },
});
