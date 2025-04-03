import "./style.css";
import * as monaco from "monaco-editor";
import Split from "split.js";
import { format } from "prettier";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as htmlParser from "prettier/parser-html";
import * as cssParser from "prettier/parser-postcss";
import prettierPluginEstree from "prettier/plugins/estree";
import {
  baseEditorOptions,
  defaultCssCode,
  defaultHtmlCode,
  defaultJsCode,
  translations,
} from "./const";
import {
  $,
  $$,
  createElement,
  generateCombinedCode,
  openNewWindow,
} from "./utils";
import { pageTemplate } from "./page-template";

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

// 创建DOM结构
const app = $("#app");
app.appendChild(createElement(pageTemplate));

// 初始化编辑器
let htmlEditor: monaco.editor.IStandaloneCodeEditor;
let cssEditor: monaco.editor.IStandaloneCodeEditor;
let jsEditor: monaco.editor.IStandaloneCodeEditor;
let currentTheme = "vs-dark";
let currentLayout = "horizontal";
let splitInstance: Split.Instance;
let currentLanguage = localStorage.getItem("editor-language") || "en";

// 初始化编辑器
function initEditor() {
  // 创建HTML编辑器
  htmlEditor = monaco.editor.create($("#html-editor")!, {
    value: defaultHtmlCode,
    language: "html",
    theme: currentTheme,
    ...baseEditorOptions,
  });

  // 创建CSS编辑器
  cssEditor = monaco.editor.create($("#css-editor")!, {
    value: defaultCssCode,
    language: "css",
    theme: currentTheme,
    ...baseEditorOptions,
  });

  // 创建JavaScript编辑器
  jsEditor = monaco.editor.create($("#js-editor")!, {
    value: defaultJsCode,
    language: "javascript",
    theme: currentTheme,
    ...baseEditorOptions,
  });

  // 设置选项卡切换事件
  setupTabSwitching();

  // 运行初始代码
  runCode();

  formatCode();
}

// 初始化布局
function initLayout() {
  const main = $("main");

  // 移除之前的split实例
  if (splitInstance) {
    splitInstance.destroy();
  }

  // 根据布局设置方向和大小
  if (currentLayout === "horizontal") {
    main.classList.remove("vertical", "preview-right", "preview-bottom");
    main.classList.add("horizontal");
    splitInstance = Split(["#editor-container", "#preview-container"], {
      direction: "horizontal",
      sizes: [50, 50],
      minSize: 200,
      gutterSize: 8,
    });
  } else if (currentLayout === "vertical") {
    main.classList.remove("horizontal", "preview-right", "preview-bottom");
    main.classList.add("vertical");
    splitInstance = Split(["#editor-container", "#preview-container"], {
      direction: "vertical",
      sizes: [50, 50],
      minSize: 100,
      gutterSize: 8,
    });
  } else if (currentLayout === "preview-right") {
    main.classList.remove("vertical", "horizontal", "preview-bottom");
    main.classList.add("preview-right");
    splitInstance = Split(["#editor-container", "#preview-container"], {
      direction: "horizontal",
      sizes: [70, 30],
      minSize: 200,
      gutterSize: 8,
    });
  } else if (currentLayout === "preview-bottom") {
    main.classList.remove("vertical", "horizontal", "preview-right");
    main.classList.add("preview-bottom");
    splitInstance = Split(["#editor-container", "#preview-container"], {
      direction: "vertical",
      sizes: [70, 30],
      minSize: 100,
      gutterSize: 8,
    });
  }

  // 通知编辑器布局已更改
  setTimeout(() => {
    if (jsEditor) {
      jsEditor.layout();
    }
  }, 100);
}

// 运行代码
function runCode() {
  const htmlCode = htmlEditor.getValue();
  const cssCode = cssEditor.getValue();
  const jsCode = jsEditor.getValue();

  // 合并代码
  const combinedCode = generateCombinedCode(htmlCode, cssCode, jsCode);

  const iframe = $<HTMLIFrameElement>("#preview-frame");
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (iframeDoc) {
    // 重新加载 iframe 内容，彻底清理所有的变量
    // 解决不释放iframe内容，导致报错Identifier 'xxx' has already been declared
    iframe.contentWindow!.location.reload();
    iframeDoc.open();
    iframeDoc.write(combinedCode);
    iframeDoc.close();
  }
}

// 设置选项卡切换
function setupTabSwitching() {
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

      // 通知编辑器布局已更改
      setTimeout(() => {
        switch (tab) {
          case "html":
            htmlEditor.layout();
            break;
          case "css":
            cssEditor.layout();
            break;
          case "js":
            jsEditor.layout();
            break;
        }
      }, 10);
    });
  });
}

// 格式化代码
async function formatCode() {
  try {
    const htmlCode = htmlEditor.getValue();
    const formattedHtmlCode = await format(htmlCode, {
      parser: "html",
      plugins: [
        prettierPluginBabel,
        prettierPluginEstree,
        htmlParser,
        cssParser,
      ],
      htmlWhitespaceSensitivity: "css",
      tabWidth: 2,
      useTabs: false,
      printWidth: 80,
      semi: true,
      singleQuote: true,
    });
    htmlEditor.setValue(formattedHtmlCode);
    const cssCode = cssEditor.getValue();
    const formattedCssCode = await format(cssCode, {
      parser: "css",
      plugins: [prettierPluginBabel, prettierPluginEstree, cssParser],
      tabWidth: 2,
      useTabs: false,
      printWidth: 80,
    });
    cssEditor.setValue(formattedCssCode);
    const jsCode = jsEditor.getValue();
    const formattedJsCode = await format(jsCode, {
      parser: "babel",
      plugins: [prettierPluginBabel, prettierPluginEstree],
      tabWidth: 2,
      useTabs: false,
      printWidth: 80,
      semi: true,
      singleQuote: true,
    });
    jsEditor.setValue(formattedJsCode);
  } catch (error) {
    console.error("Format error:", error);
  }
}

// 下载代码
function downloadCode() {
  const htmlCode = htmlEditor.getValue();
  const cssCode = cssEditor.getValue();
  const jsCode = jsEditor.getValue();

  // 合并代码
  const combinedCode = generateCombinedCode(htmlCode, cssCode, jsCode);

  // 创建Blob对象时指定正确的MIME类型和编码
  const blob = new Blob([combinedCode], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "code-editor-export.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 在新窗口中预览代码
function openInNewWindow() {
  const htmlCode = htmlEditor.getValue();
  const cssCode = cssEditor.getValue();
  const jsCode = jsEditor.getValue();

  // 合并代码
  const combinedCode = generateCombinedCode(htmlCode, cssCode, jsCode);

  // 创建一个Blob对象，指定MIME类型和编码
  const blob = new Blob([combinedCode], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // 在新窗口中打开
  openNewWindow(url);

  // 在适当的时机释放URL对象
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

// 切换主题
function changeTheme(theme: string) {
  currentTheme = theme;
  monaco.editor.setTheme(theme);
  document.body.setAttribute("data-theme", theme);

  // 更新所有编辑器的主题
  htmlEditor.updateOptions({ theme });
  cssEditor.updateOptions({ theme });
  jsEditor.updateOptions({ theme });
}

// 更新UI文本
function updateUILanguage() {
  const t = translations[currentLanguage];

  $(".logo")!.textContent = t.logo;
  // 更新按钮文本
  $("#run-btn")!.textContent = t.run;
  $("#format-btn")!.textContent = t.format;
  $("#download-btn")!.textContent = t.download;
  $("#new-window-btn")!.textContent = t.newWindow;

  // 更新下拉菜单标题
  $("#theme-dropdown .dropdown-toggle")!.textContent = t.theme;
  $("#layout-dropdown .dropdown-toggle")!.textContent = t.layout;
  $("#language-dropdown .dropdown-toggle")!.textContent = t.language;

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
}

// 事件监听
function setupEventListeners() {
  // 运行按钮
  $("#run-btn")?.addEventListener("click", runCode);

  // 格式化按钮
  $("#format-btn")?.addEventListener("click", formatCode);

  // 下载按钮
  $("#download-btn")?.addEventListener("click", downloadCode);

  // 新窗口预览按钮
  $("#new-window-btn")?.addEventListener("click", openInNewWindow);

  // 主题切换
  $$(".dropdown-menu a[data-theme]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const theme = (e.currentTarget as HTMLElement).getAttribute("data-theme");
      if (theme) {
        changeTheme(theme);
      }
      // 关闭下拉菜单
      (e.currentTarget as HTMLElement)
        .closest(".dropdown-menu")
        ?.classList.remove("show");
    });
  });

  // 布局切换
  $$(".dropdown-menu a[data-layout]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const layout = (e.currentTarget as HTMLElement).getAttribute(
        "data-layout"
      );
      if (layout) {
        currentLayout = layout;
        initLayout();
      }
      // 关闭下拉菜单
      (e.currentTarget as HTMLElement)
        .closest(".dropdown-menu")
        ?.classList.remove("show");
    });
  });

  // 语言切换
  $$(".dropdown-menu a[data-lang]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = (e.currentTarget as HTMLElement).getAttribute("data-lang");
      if (lang && lang !== currentLanguage) {
        currentLanguage = lang;
        localStorage.setItem("editor-language", lang);
        updateUILanguage();
      }
      // 关闭下拉菜单
      (e.currentTarget as HTMLElement)
        .closest(".dropdown-menu")
        ?.classList.remove("show");
    });
  });

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

  // 为预览框添加事件监听，确保点击预览区域也能关闭下拉菜单
  const previewFrame = $<HTMLIFrameElement>("#preview-frame");
  previewFrame.addEventListener("load", () => {
    // 当iframe加载完成后，为其内部文档添加点击事件
    const iframeDoc =
      previewFrame.contentDocument || previewFrame.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.addEventListener("click", () => {
        // 关闭所有下拉菜单
        $$(".dropdown-menu.show").forEach((menu) => {
          menu.classList.remove("show");
        });
      });
    }
  });
}

function setEditorContent(data: Record<string, string>[]) {
  if (Array.isArray(data)) {
    try {
      data.forEach((item) => {
        if (item.type === "html" && item.content) {
          htmlEditor.setValue(item.content);
        } else if (item.type === "css" && item.content) {
          cssEditor.setValue(item.content);
        } else if (item.type === "js" && item.content) {
          jsEditor.setValue(item.content);
        }
      });
      // 更新预览
      runCode();
      formatCode();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
}

// 初始化应用
function init() {
  initEditor();
  initLayout();
  setupEventListeners();
  updateUILanguage(); // 应用语言设置
  // 接收端
  window.addEventListener("message", function (event) {
    if (Array.isArray(event.data)) {
      setEditorContent(event.data);
    }
  });

  // 设置初始主题
  document.body.setAttribute("data-theme", currentTheme);
}

// 启动应用
init();
