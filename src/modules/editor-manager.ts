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
import { $, $$, logger } from "../utils";
import loader from "@monaco-editor/loader";
import { runCode } from "./preview-manager";
import { ewConfirm } from "../plugins/modal";

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

// TypeScript 编译器选项
const tsCompilerOptions = {
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  lib: [
    "es2020",
    "dom"
  ],
  allowJs: true,
  skipLibCheck: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  strict: false,
  forceConsistentCasingInFileNames: false,
  noFallthroughCasesInSwitch: false,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  resolveJsonModule: false,
  isolatedModules: false,
  noEmit: true,
  jsx: monaco.languages.typescript.JsxEmit.React,
  noImplicitAny: false,
  noImplicitReturns: false,
  noImplicitThis: false,
  noUncheckedIndexedAccess: false,
  exactOptionalPropertyTypes: false,
};

// 配置 TypeScript 语言服务
function configureTypeScript() {
  if (!editorInstance) return;
  
  try {
    // 启用TypeScript语言服务的诊断功能，但优化配置
    editorInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    
    editorInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    
    // 配置 TypeScript 编译器选项
    editorInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...tsCompilerOptions,
      strict: false, // 关闭严格模式，减少错误
      noImplicitAny: false, // 允许隐式any
      noImplicitReturns: false,
      noImplicitThis: false,
      noUncheckedIndexedAccess: false,
      exactOptionalPropertyTypes: false,
    });
    
    editorInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...tsCompilerOptions,
      strict: false,
      noImplicitAny: false,
      noImplicitReturns: false,
      noImplicitThis: false,
      noUncheckedIndexedAccess: false,
      exactOptionalPropertyTypes: false,
    });
    
    // 添加类型定义
    editorInstance.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' {
        export = React;
        export as namespace React;
      }`,
      'react.d.ts'
    );
    
    editorInstance.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react-dom' {
        export = ReactDOM;
        export as namespace ReactDOM;
      }`,
      'react-dom.d.ts'
    );
    
    editorInstance.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'vue' {
        export = Vue;
        export as namespace Vue;
      }`,
      'vue.d.ts'
    );
    
    // 添加 React JSX 支持
    editorInstance.languages.typescript.typescriptDefaults.addExtraLib(
      `declare namespace JSX {
        interface Element {}
        interface IntrinsicElements {
          [elemName: string]: any;
        }
      }`,
      'jsx.d.ts'
    );
    
    // 添加基础类型定义
    editorInstance.languages.typescript.typescriptDefaults.addExtraLib(
      `declare global {
        interface Window {
          React: any;
          ReactDOM: any;
          Vue: any;
          ts: any;
        }
      }`,
      'global.d.ts'
    );
    
    logger.success('TypeScript language service configured successfully');
  } catch (error) {
    logger.warning('TypeScript configuration error:', error);
  }
}

/**
 * 安全地配置TypeScript，避免工作器错误
 */
function safeConfigureTypeScript() {
  if (!editorInstance) return;
  
  try {
    // 先进行基础配置
    configureTypeScript();
    
    // 延迟进行额外配置，确保工作器完全初始化
    setTimeout(() => {
      try {
        // 确保工作器正确初始化
        if (editorInstance) {
          // 重新设置诊断选项，确保工作器状态正确
          editorInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true, // 默认禁用，等切换框架时再启用
            noSyntaxValidation: true,
            noSuggestionDiagnostics: true,
          });
          
          editorInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
            noSuggestionDiagnostics: true,
          });
          
          logger.success('TypeScript worker initialized successfully');
        }
      } catch (error) {
        logger.warning('Delayed TypeScript configuration failed:', error);
      }
    }, 1000);
  } catch (error) {
    logger.warning('Safe TypeScript configuration error:', error);
  }
}

/**
 * 重置TypeScript语言服务
 */
function resetTypeScriptService() {
  if (!editorInstance) return;
  
  try {
    // 启用TypeScript语言服务的诊断功能
    editorInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });
    
    editorInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });
    
    // 重新配置编译器选项
    editorInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...tsCompilerOptions,
      strict: false,
      noImplicitAny: false,
      noImplicitReturns: false,
      noImplicitThis: false,
      noUncheckedIndexedAccess: false,
      exactOptionalPropertyTypes: false,
    });
    
    editorInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...tsCompilerOptions,
      strict: false,
      noImplicitAny: false,
      noImplicitReturns: false,
      noImplicitThis: false,
      noUncheckedIndexedAccess: false,
      exactOptionalPropertyTypes: false,
    });
    
    logger.success('TypeScript service reset successfully');
  } catch (error) {
    logger.warning('Error resetting TypeScript service:', error);
  }
}

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
    
    // 等待Monaco编辑器完全初始化
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 重置TypeScript语言服务
    resetTypeScriptService();
    
    // 配置 TypeScript 支持
    safeConfigureTypeScript();
    
    // 等待TypeScript配置完成
    await new Promise(resolve => setTimeout(resolve, 100));
    
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

    // 等待编辑器完全加载
    await new Promise(resolve => setTimeout(resolve, 300));

  } catch (err) {
    logger.error('Editor creation error:', err);
    ewConfirm({
      title: "编辑器加载失败",
      content: "编辑器加载失败，请刷新页面重试",
      sureText: "刷新",
      sure: () => {
        window.location.reload();
      },
    });
  } finally {
    // 无论成功还是失败，都隐藏加载效果
    hideLoading("global");
  }
  return { htmlEditor, cssEditor, jsEditor };
}

/**
 * 更新所有编辑器的主题
 * @param theme 主题名称
 */
export function updateEditorsTheme(theme: string) {
  editorInstance?.editor.setTheme(theme);
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
    logger.error("Error setting editor content:", error);
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

    // 格式化JavaScript/TypeScript代码
    const jsCode = jsEditor.getValue();
    const isTypeScript = jsCode.includes(':') && (
      jsCode.includes('interface') || 
      jsCode.includes('type ') || 
      jsCode.includes(': string') || 
      jsCode.includes(': number') ||
      jsCode.includes(': boolean') ||
      jsCode.includes(': any') ||
      jsCode.includes('import ') ||
      jsCode.includes('export ') ||
      jsCode.includes('React.FC') ||
      jsCode.includes('defineComponent') ||
      jsCode.includes('Ref<') ||
      jsCode.includes('Promise<')
    );
    
    try {
      // 预处理TypeScript代码，移除可能导致解析错误的语法
      let processedCode = jsCode;
      if (isTypeScript) {
        // 移除private、public、protected等访问修饰符
        processedCode = processedCode.replace(/\b(private|public|protected)\s+/g, '');
        // 移除类型注解中的复杂类型
        processedCode = processedCode.replace(/: [A-Z][a-zA-Z]*<[^>]*>/g, ': any');
        // 移除简单的类型注解，如 : string, : number, : boolean
        processedCode = processedCode.replace(/: (string|number|boolean|any)\b/g, '');
        // 移除函数参数的类型注解，但保留参数名
        processedCode = processedCode.replace(/\(([^)]*)\)/g, (_match, params) => {
          return '(' + params.replace(/: [^,)]+/g, '') + ')';
        });
        // 移除接口定义
        processedCode = processedCode.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
        // 移除类型定义
        processedCode = processedCode.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
        // 移除React.FC类型注解
        processedCode = processedCode.replace(/React\.FC/g, '');
        // 移除useState的类型注解
        processedCode = processedCode.replace(/useState<[^>]*>/g, 'useState');
        
        // 检查代码是否包含React.createElement，如果是则使用更保守的格式化
        const isReactCode = processedCode.includes('React.createElement');
        if (isReactCode) {
          // 对于React代码，使用更简单的格式化配置
          const formattedJsCode = await format(processedCode, {
            parser: "babel",
            plugins: [prettierPluginBabel, prettierPluginEstree],
            tabWidth: 2,
            useTabs: false,
            printWidth: 100,
            semi: true,
            singleQuote: true,
            bracketSpacing: true,
            bracketSameLine: false,
            arrowParens: "avoid",
            trailingComma: "none",
          });
          jsEditor.setValue(formattedJsCode);
          return;
        }
      }
      
      const formattedJsCode = await format(processedCode, {
        parser: "babel",
        plugins: [prettierPluginBabel, prettierPluginEstree],
        tabWidth: 2,
        useTabs: false,
        printWidth: 80,
        semi: true,
        singleQuote: true,
        jsxSingleQuote: true,
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: "avoid",
        trailingComma: "es5",
      });
      jsEditor.setValue(formattedJsCode);
    } catch (formatError) {
      logger.error("Format error:", formatError);
      // 如果格式化失败，尝试使用默认的babel解析器
      try {
        const fallbackFormattedCode = await format(jsCode, {
          parser: "babel",
          plugins: [prettierPluginBabel, prettierPluginEstree],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
          semi: true,
          singleQuote: true,
        });
        jsEditor.setValue(fallbackFormattedCode);
      } catch (fallbackError) {
        logger.error("Fallback format error:", fallbackError);
        // 显示格式化错误提示
        ewConfirm({
          title: "格式化失败",
          content: `代码格式化失败：${formatError instanceof Error ? formatError.message : '未知错误'}`,
          sureText: "确定",
        });
      }
    }
  } catch (error) {
    logger.error("Format error:", error);
    // 显示格式化错误提示
    ewConfirm({
      title: "格式化失败",
      content: `代码格式化失败：${error instanceof Error ? error.message : '未知错误'}`,
      sureText: "确定",
    });
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
  try {
    // 检查框架是否包含TypeScript
    const isTypeScript = framework.includes("ts") || framework === "typescript";
    const isReact = framework.includes("react");
    const isVue = framework.includes("vue");

    // 根据框架类型启用或禁用TypeScript检查
    if (isTypeScript) {
      enableTypeScriptChecking();
    } else {
      disableTypeScriptChecking();
    }

    // 更新JavaScript编辑器的语言模式
    if (jsEditor) {
      let language = "javascript";
      
      if (isTypeScript) {
        language = "typescript";
      } else if (isReact) {
        language = "javascript";
      } else if (isVue) {
        language = "javascript";
      }
      
      try {
        const model = jsEditor.getModel();
        if (model) {
          // 检查模型是否有效
          if (model.getLanguageId() !== language) {
            // 获取当前代码内容
            const currentValue = jsEditor.getValue();
            
            // 先销毁旧模型，确保工作器清理
            model.dispose();
            
            // 等待一小段时间让工作器清理完成
            setTimeout(() => {
              try {
                // 创建新模型
                const newModel = editorInstance?.editor.createModel(currentValue, language);
                if (newModel) {
                  jsEditor.setModel(newModel);
                  
                  // 延迟更新编译器选项，确保模型已完全加载
                  setTimeout(() => {
                    try {
                      if (isTypeScript && editorInstance) {
                        const options = { ...tsCompilerOptions };
                        if (isReact) {
                          options.jsx = monaco.languages.typescript.JsxEmit.React;
                        }
                        
                        // 重新配置TypeScript选项
                        editorInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
                          ...options,
                          strict: false,
                          noImplicitAny: false,
                          noImplicitReturns: false,
                          noImplicitThis: false,
                          noUncheckedIndexedAccess: false,
                          exactOptionalPropertyTypes: false,
                        });
                        editorInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
                          ...options,
                          strict: false,
                          noImplicitAny: false,
                          noImplicitReturns: false,
                          noImplicitThis: false,
                          noUncheckedIndexedAccess: false,
                          exactOptionalPropertyTypes: false,
                        });
                        
                        logger.success(`TypeScript model created successfully for ${framework}`);
                      }
                    } catch (configError) {
                      logger.warning('Error updating TypeScript config:', configError);
                    }
                  }, 200);
                }
              } catch (createError) {
                logger.error('Error creating new model:', createError);
                // 如果创建失败，尝试使用原始方法
                try {
                  const fallbackModel = editorInstance?.editor.createModel(currentValue, language);
                  if (fallbackModel) {
                    jsEditor.setModel(fallbackModel);
                  }
                } catch (fallbackError) {
                  logger.error('Fallback model creation failed:', fallbackError);
                }
              }
            }, 50);
          }
        }
      } catch (modelError) {
        logger.warning('Error updating model language:', modelError);
        // 如果模型更新失败，尝试重新创建模型
        try {
          const currentValue = jsEditor.getValue();
          const newModel = editorInstance?.editor.createModel(currentValue, language);
          if (newModel) {
            jsEditor.setModel(newModel);
          }
        } catch (recreateError) {
          logger.error('Error recreating model:', recreateError);
        }
      }
    }

    // 更新标签显示
    const element = [...$$(".tabs .tab-btn")].find(
      (item) => item.getAttribute("data-tab") === "js"
    );
    if (element) {
      let displayName = "javascript";
      if (isTypeScript) {
        displayName = isReact ? "tsx" : "typescript";
      } else if (isReact) {
        displayName = "jsx";
      }
      element.textContent = displayName;
    }
    
    // 延迟运行代码，确保语言模式更新完成
    setTimeout(() => {
      runCode();
    }, 300);
  } catch (error) {
    logger.error('Error updating JavaScript editor language:', error);
  }
}

/**
 * 获取TypeScript编译错误
 * @returns 编译错误数组
 */
export function getTypeScriptErrors(): monaco.editor.IMarkerData[] {
  try {
    if (!jsEditor) return [];
    
    const model = jsEditor.getModel();
    if (!model) return [];
    
    // 获取所有诊断标记
    const markers = editorInstance?.editor.getModelMarkers({ resource: model.uri });
    return markers || [];
  } catch (error) {
    logger.warning('Error getting TypeScript errors:', error);
    return [];
  }
}

/**
 * 显示TypeScript编译错误
 */
export function showTypeScriptErrors() {
  try {
    const errors = getTypeScriptErrors();
    
    if (errors.length === 0) {
      logger.success('TypeScript 检查通过，没有发现错误！');
      return;
    }
    
    // 显示错误信息
    const errorMessages = errors.map(error => 
      `第 ${error.startLineNumber} 行: ${error.message}`
    ).join('\n');
    
    logger.error(`发现 ${errors.length} 个 TypeScript 错误:`, errorMessages);
    
    // 也可以显示弹窗
    ewConfirm({
      title: "TypeScript 检查结果",
      content: `发现 ${errors.length} 个错误:\n${errorMessages}`,
      sureText: "确定",
    });
  } catch (error) {
    logger.error('Error showing TypeScript errors:', error);
    ewConfirm({
      title: "TypeScript 检查失败",
      content: "无法检查TypeScript错误，请稍后重试",
      sureText: "确定",
    });
  }
}

/**
 * 启用TypeScript检查
 */
function enableTypeScriptChecking() {
  if (!editorInstance) return;
  
  try {
    // 启用TypeScript语言服务的诊断功能
    editorInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });
    
    editorInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });
    
    logger.success('TypeScript checking enabled');
  } catch (error) {
    logger.warning('Error enabling TypeScript checking:', error);
  }
}

/**
 * 禁用TypeScript检查
 */
function disableTypeScriptChecking() {
  if (!editorInstance) return;
  
  try {
    // 禁用TypeScript语言服务的诊断功能
    editorInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    
    editorInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    
    logger.info('TypeScript checking disabled');
  } catch (error) {
    logger.warning('Error disabling TypeScript checking:', error);
  }
}
