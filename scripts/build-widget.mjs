import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

const backendUrl = JSON.stringify(process.env.NEXT_PUBLIC_BACKEND_URL ?? "");

await mkdir(distDir, { recursive: true });

try {
  await build({
    entryPoints: [path.join(projectRoot, "src", "embed", "chatbot-widget.tsx")],
    bundle: true,
    format: "iife",
    globalName: "ChatbotWidgetBundle",
    minify: true,
    sourcemap: true,
    platform: "browser",
    outfile: path.join(distDir, "chatbot-widget.js"),
    target: ["es2019"],
    tsconfig: path.join(projectRoot, "tsconfig.json"),
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.NEXT_PUBLIC_BACKEND_URL": backendUrl,
    },
    loader: {
      ".png": "dataurl",
      ".jpg": "dataurl",
      ".jpeg": "dataurl",
      ".gif": "dataurl",
      ".svg": "dataurl",
    },
    logLevel: "info",
  });
  console.log("\nChatbot widget bundle created at dist/chatbot-widget.js\n");
} catch (error) {
  console.error("Failed to build chatbot widget bundle:\n", error);
  process.exit(1);
}
