import { translations } from "../const";
import { $, $$ } from "../utils";

/**
 * 更新UI文本
 * @param language 当前语言
 */
export function updateUILanguage(language: string) {
  const t = translations[language];

  $(".logo")!.textContent = t.logo;
  // 更新按钮文本
  $("#run-btn")!.textContent = t.run;
  $("#format-btn")!.textContent = t.format;
  $("#download-btn")!.textContent = t.download;
  $("#new-window-btn")!.textContent = t.newWindow;

  // 更新下拉菜单标题
  $("#framework-dropdown .dropdown-toggle")!.textContent = t.framework;
  $("#theme-dropdown .dropdown-toggle")!.textContent = t.theme;
  $("#layout-dropdown .dropdown-toggle")!.textContent = t.layout;
  $("#language-dropdown .dropdown-toggle")!.textContent = t.language;

  // 更新框架选项
  const frameworkItems = $$("#framework-dropdown .dropdown-menu a");
  frameworkItems[0].textContent = t.vanilla;
  frameworkItems[1].textContent = t.react;
  frameworkItems[2].textContent = t.vue;

  // 更新主题选项
  const themeItems = $$("#theme-dropdown .dropdown-menu a");
  themeItems[0].textContent = t.light;
  themeItems[1].textContent = t.dark;
  themeItems[2].textContent = t.highContrast;

  // 更新布局选项
  const layoutItems = $$("#layout-dropdown .dropdown-menu a");
  layoutItems[0].textContent = t.horizontal;
  layoutItems[1].textContent = t.vertical;
  layoutItems[2].textContent = t.previewRight;
  layoutItems[3].textContent = t.previewBottom;

  // 更新语言选项
  const langItems = $$("#language-dropdown .dropdown-menu a");
  langItems[0].textContent = t.english;
  langItems[1].textContent = t.chinese;

  // 更新依赖管理面板
  $("#dependency-manager .dependency-header h3")!.textContent = t.dependencies;
  $("#install-btn")!.textContent = t.install;
  $("#close-dependency-btn")!.textContent = t.close;
  $("#add-dependency-btn")!.textContent = t.dependencies;
}

/**
 * 设置选项卡切换
 * @param onTabChange 标签切换回调
 */
export function setupTabSwitching(onTabChange: (tab: string) => void) {
  const tabButtons = $$(".tab-btn");
  const editorPanes = $$(".editor-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-tab");
      if (!tab) return;

      // 更新按钮状态
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 更新编辑器面板显示
      editorPanes.forEach((pane) => pane.classList.remove("active"));
      $(`#${tab}-editor`)?.classList.add("active");

      // 调用回调函数
      onTabChange(tab);
    });
  });
}

/**
 * 设置下拉菜单交互
 */
export function setupDropdownInteractions() {
  // 下拉菜单交互
  $$(".dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // 阻止事件冒泡

      const currentDropdown = (e.currentTarget as HTMLElement)
        .nextElementSibling;

      // 关闭所有其他下拉菜单
      $$(".dropdown-menu.show").forEach((menu) => {
        if (menu !== currentDropdown) {
          menu.classList.remove("show");
        }
      });

      // 切换当前下拉菜单
      currentDropdown?.classList.toggle("show");
    });
  });

  // 点击外部关闭下拉菜单
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // 如果点击的不是下拉菜单或其子元素
    if (!target.closest(".dropdown")) {
      $$(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });
}

/**
 * 关闭所有下拉菜单
 */
export function closeAllDropdowns() {
  $$(".dropdown-menu.show").forEach((menu) => {
    menu.classList.remove("show");
  });
}

/**
 * 为预览框添加事件监听
 */
export function setupPreviewFrameListeners() {
  const previewFrame = $<HTMLIFrameElement>("#preview-frame");
  previewFrame.addEventListener("load", () => {
    // 当iframe加载完成后，为其内部文档添加点击事件
    const iframeDoc =
      previewFrame.contentDocument || previewFrame.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.addEventListener("click", () => {
        // 关闭所有下拉菜单
        closeAllDropdowns();
      });
    }
  });
}
