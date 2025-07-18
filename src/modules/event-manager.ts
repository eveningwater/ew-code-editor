/**
 * 事件管理模块
 */
import { $, $$ } from "../utils";
import { runCode, downloadCode, openInNewWindow } from "./preview-manager";
import { formatEditorsCode, notifyEditorLayoutChange, showTypeScriptErrors } from "./editor-manager";
import { initLayout } from "./layout-manager";
import {
  closeAllDropdowns,
  setupDropdownInteractions,
  setupPreviewFrameListeners,
  setupTabSwitching,
  updateUILanguage,
} from "./ui-manager";
import {
  getConfig,
  updateLanguage,
  updateLayout,
  updateTheme,
  updateFrameworkConfig,
} from "./config-manager";
import {
  setupFrameworkEvents,
  showDependencyManager,
} from "./framework-manager";

/**
 * 设置所有事件监听器
 */
export function setupEventListeners() {
  // 设置选项卡切换事件
  setupTabSwitching((tab) => {
    notifyEditorLayoutChange(tab);
  });

  // 设置下拉菜单交互
  setupDropdownInteractions();

  // 设置预览框事件监听
  setupPreviewFrameListeners();

  // 设置框架相关事件
  setupFrameworkEvents();

  // 运行按钮
  $("#run-btn")?.addEventListener("click", runCode);

  // 格式化按钮
  $("#format-btn")?.addEventListener("click", formatEditorsCode);

  // TypeScript错误检查按钮
  $("#ts-check-btn")?.addEventListener("click", showTypeScriptErrors);

  // 下载按钮
  $("#download-btn")?.addEventListener("click", downloadCode);

  // 新窗口预览按钮
  $("#new-window-btn")?.addEventListener("click", openInNewWindow);

  // 添加依赖按钮 - 显示依赖管理面板
  $("#add-dependency-btn")?.addEventListener("click", showDependencyManager);

  // 主题切换
  $$("a[data-theme]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const theme = (e.currentTarget as HTMLElement).getAttribute("data-theme");
      if (theme) {
        updateTheme(theme);
      }
      // 关闭下拉菜单
      closeAllDropdowns();
    });
  });

  // 布局切换
  $$("a[data-layout]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const layout = (e.currentTarget as HTMLElement).getAttribute(
        "data-layout"
      );
      if (layout) {
        updateLayout(layout);
        initLayout(layout as any);
      }
      // 关闭下拉菜单
      closeAllDropdowns();
    });
  });

  // 语言切换
  $$("a[data-lang]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = (e.currentTarget as HTMLElement).getAttribute("data-lang");
      const config = getConfig();
      if (lang && lang !== config.language) {
        updateLanguage(lang);
        updateUILanguage(lang);
      }
      // 关闭下拉菜单
      closeAllDropdowns();
    });
  });

  // 框架切换
  $$("a[data-framework]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const framework = (e.currentTarget as HTMLElement).getAttribute(
        "data-framework"
      );
      if (framework) {
        updateFrameworkConfig(framework);
        formatEditorsCode();
      }
      // 关闭下拉菜单
      closeAllDropdowns();
    });
  });

  // 接收外部消息
  window.addEventListener("message", async function (event) {
    const { showLoading, hideLoading } = await import("../utils");
    if (Array.isArray(event.data)) {
      showLoading();
      handleExternalMessage(event.data);
      setTimeout(() => {
        hideLoading();
      }, 2000);
    }
  });
}

/**
 * 处理外部消息
 * @param data 消息数据
 */
function handleExternalMessage(data: Record<string, string>[]) {
  // 这里可以添加消息处理逻辑
  // 目前只是简单地将消息传递给编辑器
  import("./editor-manager").then(({ setEditorsContent }) => {
    setEditorsContent(data);
    runCode();
    formatEditorsCode();
  });
}
