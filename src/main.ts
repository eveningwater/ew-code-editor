import "./style.css";
import { $ } from "./utils";
import { createElement } from "./utils";
import { pageTemplate } from "./page-template";
import { createEditors, formatEditorsCode } from "./modules/editor-manager";
import { initLayout, LayoutType } from "./modules/layout-manager";
import { setupEventListeners } from "./modules/event-manager";
import { updateUILanguage } from "./modules/ui-manager";
import { getConfig } from "./modules/config-manager";
import { runCode } from "./modules/preview-manager";
import { updateFramework } from "./modules/framework-manager";

/**
 * 初始化应用
 */
async function init() {
  // 创建DOM结构
  const app = $("#app");
  app.appendChild(createElement(pageTemplate));

  // 获取当前配置
  const config = getConfig();

  // 创建编辑器
  await createEditors(config.theme);

  // 初始化布局
  initLayout(config.layout as LayoutType);

  // 设置事件监听
  setupEventListeners();

  // 应用语言设置
  updateUILanguage(config.language);

  // 设置初始主题
  document.body.setAttribute("data-theme", config.theme);

  // 设置初始框架
  updateFramework("vanilla");

  // 运行初始代码
  runCode();

  // 格式化代码
  formatEditorsCode();
}

// 启动应用
init();
