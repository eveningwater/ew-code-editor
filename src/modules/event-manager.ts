/**
 * 事件管理模块
 */
import { $, $$ } from "../utils";
import { runCode, downloadCode, openInNewWindow } from "./preview-manager";
import { formatEditorsCode, notifyEditorLayoutChange } from "./editor-manager";
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
} from "./config-manager";

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

  // 运行按钮
  $("#run-btn")?.addEventListener("click", runCode);

  // 格式化按钮
  $("#format-btn")?.addEventListener("click", formatEditorsCode);

  // 下载按钮
  $("#download-btn")?.addEventListener("click", downloadCode);

  // 新窗口预览按钮
  $("#new-window-btn")?.addEventListener("click", openInNewWindow);

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

  // 接收外部消息
  window.addEventListener("message", function (event) {
    import("../utils").then(({ showLoading }) => {
      showLoading();
    });
    if (Array.isArray(event.data)) {
      handleExternalMessage(event.data);
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
  import("./editor-manager")
    .then(({ setEditorsContent }) => {
      setEditorsContent(data);
      runCode();
      formatEditorsCode().finally(() => {
        // 格式化完成后隐藏加载效果
        import("../utils").then(({ hideLoading }) => {
          hideLoading();
        });
      });
    })
    .catch((error) => {
      console.error("Error handling external message:", error);
      // 发生错误时也要隐藏加载效果
      import("../utils").then(({ hideLoading }) => {
        hideLoading();
      });
    });
}
