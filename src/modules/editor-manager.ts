import * as monaco from "monaco-editor";
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
} from "../const";
import { $, $$ } from "../utils";
import loader from "@monaco-editor/loader";
import { runCode } from "./preview-manager";

// 配置 Monaco 编辑器的 CDN 路径
loader.config({
  paths: {
    vs: "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.52.2/min/vs",
  },
});

// 编辑器实例
let htmlEditor: monaco.editor.IStandaloneCodeEditor;
let cssEditor: monaco.editor.IStandaloneCodeEditor;
let jsEditor: monaco.editor.IStandaloneCodeEditor;
let editorInstance: typeof monaco | null = null;
/**
 * 获取编辑器实例
 */ /**
 * 获取编辑器实例
 */
/**
 * 创建编辑器实例
 * @param theme 当前主题
 */
export async function createEditors(theme: string) {
  const { showLoading, hideLoading } = await import("../utils");
  // 显示所有编辑器的加载效果
  showLoading("global");
  try {
    editorInstance = await loader.init();
    // 创建HTML编辑器
    htmlEditor = editorInstance.editor.create($("#html-editor")!, {
      value: defaultHtmlCode,
      language: "html",
      theme,
      ...baseEditorOptions,
    });

    // 创建CSS编辑器
    cssEditor = editorInstance.editor.create($("#css-editor")!, {
      value: defaultCssCode,
      language: "css",
      theme,
      ...baseEditorOptions,
    });

    // 创建JavaScript编辑器
    jsEditor = editorInstance.editor.create($("#js-editor")!, {
      value: defaultJsCode,
      language: "javascript",
      theme,
      ...baseEditorOptions,
    });

    return { htmlEditor, cssEditor, jsEditor };
  } finally {
    // 无论成功还是失败，都隐藏加载效果
    hideLoading("global");
  }
}

/**
 * 更新所有编辑器的主题
 * @param theme 主题名称
 */
export function updateEditorsTheme(theme: string) {
  monaco.editor.setTheme(theme);
  htmlEditor.updateOptions({ theme });
  cssEditor.updateOptions({ theme });
  jsEditor.updateOptions({ theme });
}

/**
 * 获取所有编辑器的代码
 */
export function getEditorsCode() {
  return {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  };
}

/**
 * 设置编辑器内容
 * @param data 编辑器内容数据
 */
export function setEditorsContent(data: Record<string, string>[]) {
  if (!Array.isArray(data)) return;

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
  } catch (error) {
    console.error("Error setting editor content:", error);
  }
}

/**
 * 格式化所有编辑器的代码
 */
export async function formatEditorsCode() {
  try {
    // 格式化HTML代码
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

    // 格式化CSS代码
    const cssCode = cssEditor.getValue();
    const formattedCssCode = await format(cssCode, {
      parser: "css",
      plugins: [prettierPluginBabel, prettierPluginEstree, cssParser],
      tabWidth: 2,
      useTabs: false,
      printWidth: 80,
    });
    cssEditor.setValue(formattedCssCode);

    // 格式化JavaScript代码
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

/**
 * 通知编辑器布局已更改
 * @param activeTab 当前激活的标签
 */
export function notifyEditorLayoutChange(activeTab?: string) {
  setTimeout(() => {
    if (activeTab) {
      switch (activeTab) {
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
    } else {
      // 如果没有指定标签，则更新所有编辑器
      htmlEditor.layout();
      cssEditor.layout();
      jsEditor.layout();
    }
  }, 10);
}

/**
 * 更新JavaScript编辑器的语言模式
 * @param framework 当前框架
 */
export function updateJsEditorLanguage(framework: string) {
  // 检查框架是否包含TypeScript
  const isTypeScript = framework.includes("ts") || framework === "typescript";

  // 更新JavaScript编辑器的语言模式
  if (jsEditor) {
    editorInstance?.editor.setModelLanguage(
      jsEditor.getModel()!,
      isTypeScript ? "typescript" : "javascript"
    );
  }

  const element = [...$$(".tabs .tab-btn")].find(
    (item) => item.getAttribute("data-tab") === "js"
  );
  if (element) {
    element.textContent = isTypeScript ? "typescript" : "javascript";
  }
  runCode();
}
