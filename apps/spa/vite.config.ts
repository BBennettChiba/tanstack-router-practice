import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  envDir: "../../",
  plugins: [TanStackRouterVite(), react(), deno()],
});
