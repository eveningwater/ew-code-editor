import "./style.css";
import { $ } from "./utils";
import { createElement } from "./utils";
import { pageTemplate } from "./page-template";
import { createEditors, formatEditorsCode } from "./modules/editor-manager";
import { initLayout } from "./modules/layout-manager";
import { setupEventListeners } from "./modules/event-manager";
import { updateUILanguage } from "./modules/ui-manager";
import { getConfig } from "./modules/config-manager";
import { runCode } from "./modules/preview-manager";

/**
 * 配置Monaco编辑器的Web Worker
 */
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === "json") {
      return new URL(
        "monaco-editor/esm/vs/language/json/json.worker.js",
        import.meta.url
      ).href;
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new URL(
        "monaco-editor/esm/vs/language/css/css.worker.js",
        import.meta.url
      ).href;
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new URL(
        "monaco-editor/esm/vs/language/html/html.worker.js",
        import.meta.url
      ).href;
    }
    if (label === "typescript" || label === "javascript") {
      return new URL(
        "monaco-editor/esm/vs/language/typescript/ts.worker.js",
        import.meta.url
      ).href;
    }

    return new URL(
      "monaco-editor/esm/vs/editor/editor.worker.js",
      import.meta.url
    ).href;
  },
  getWorker: function (_moduleId: string, label: string) {
    const workerUrl = this.getWorkerUrl!(_moduleId, label);
    return new Worker(workerUrl, { type: "module" });
  },
};

/**
 * 初始化应用
 */
function init() {
  // 创建DOM结构
  const app = $("#app");
  app.appendChild(createElement(pageTemplate));

  // 获取当前配置
  const config = getConfig();

  // 创建编辑器
  createEditors(config.theme);

  // 初始化布局
  initLayout(config.layout as any);

  // 设置事件监听
  setupEventListeners();

  // 应用语言设置
  updateUILanguage(config.language);

  // 设置初始主题
  document.body.setAttribute("data-theme", config.theme);

  // 运行初始代码
  runCode();

  // 格式化代码
  formatEditorsCode();
}

// 启动应用
init();
