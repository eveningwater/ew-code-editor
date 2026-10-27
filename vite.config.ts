import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      // 为Monaco编辑器的worker文件提供别名
      "monaco-editor": resolve(__dirname, "node_modules/monaco-editor"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Monaco编辑器的代码分离到单独的chunk中
          "monaco-editor": ["monaco-editor"],
        },
      },
    },
  },
  optimizeDeps: {
    // monaco 的 ?worker 深导入与依赖预构建不兼容，需排除
    exclude: ["monaco-editor"],
  },
  server: {
    // 确保开发服务器正确处理worker文件的MIME类型
    fs: {
      strict: false,
    },
  },
});
