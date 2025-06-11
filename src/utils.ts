import {
  getFrameworkCDNs,
  getDependencyCDNs,
  getCurrentFramework,
} from "./modules/framework-manager";

export const generateCombinedCode = (html: string, css: string, js: string) => {
  // 解析HTML以找到插入点
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 确保有正确的字符集元标签
  let metaCharset = doc.querySelector("meta[charset]");
  if (!metaCharset) {
    metaCharset = doc.createElement("meta");
    metaCharset.setAttribute("charset", "UTF-8");
    if (doc.head.firstChild) {
      doc.head.insertBefore(metaCharset, doc.head.firstChild);
    } else {
      doc.head.appendChild(metaCharset);
    }
  }

  // 获取当前框架
  const currentFramework = getCurrentFramework();

  // 添加框架CDN
  const frameworkCDNs = getFrameworkCDNs();
  frameworkCDNs.forEach((cdn) => {
    const scriptElement = doc.createElement("script");
    scriptElement.src = cdn;
    doc.head.appendChild(scriptElement);
  });

  // 添加用户安装的依赖CDN
  const dependencyCDNs = getDependencyCDNs();
  dependencyCDNs.forEach((cdn) => {
    if (cdn.endsWith(".css")) {
      // 对于CSS文件，使用link标签
      const linkElement = doc.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = cdn;
      doc.head.appendChild(linkElement);
    } else {
      // 对于JS文件，使用script标签
      const scriptElement = doc.createElement("script");
      scriptElement.src = cdn;
      doc.head.appendChild(scriptElement);
    }
  });

  // 添加CSS
  if (css.trim()) {
    const styleElement = doc.createElement("style");
    styleElement.textContent = css;
    doc.head.appendChild(styleElement);
  }

  // 为React和其他需要CommonJS模块系统的库添加模拟的require函数
  if (currentFramework === "react" || dependencyCDNs.length > 0) {
    const requireScript = doc.createElement("script");
    requireScript.textContent = `
      // 模拟CommonJS的require函数
      window.require = function(module) {
        // 简单的模块映射
        const modules = {
          'react': window.React,
          'react-dom': window.ReactDOM,
          'antd': window.antd
        };
        
        // 返回请求的模块
        if (modules[module]) {
          return modules[module];
        } else {
          console.warn('Module not found:', module);
          return {};
        }
      };
    `;
    doc.head.appendChild(requireScript);
  }

  // 添加JavaScript
  if (js.trim()) {
    const scriptElement = doc.createElement("script");

    // 对于React，需要使用Babel转换JSX
    if (currentFramework === "react" || currentFramework === "react-ts") {
      scriptElement.type = "text/babel";
    }

    // 对于TypeScript相关框架，添加类型声明和编译配置
    if (currentFramework.includes("ts") || currentFramework === "typescript") {
      // 添加TypeScript编译选项
      const tsConfigScript = doc.createElement("script");
      tsConfigScript.textContent = `
        // TypeScript编译选项
        window.ts = window.ts || {};
        window.ts.transpileModule = window.ts.transpileModule || function(code) { return { outputText: code }; };
        
        // 设置TypeScript编译选项
        var tsConfig = {
          compilerOptions: {
            target: "es2015",
            module: "esnext",
            jsx: "react",
            jsxFactory: "React.createElement",
            jsxFragmentFactory: "React.Fragment",
            strict: true,
            esModuleInterop: true
          }
        };

        // 添加Vue类型声明
        if (typeof Vue !== 'undefined') {
          // Vue 2 类型声明
          if (Vue.version && Vue.version.startsWith('2')) {
            window.Vue = Vue;
          }
          // Vue 3 类型声明
          else if (Vue.createApp) {
            window.Vue = Vue;
          }
        }
      `;
      doc.head.appendChild(tsConfigScript);

      // 包装TypeScript代码，使其在运行前先编译
      const originalCode = js;
      if (currentFramework === "react-ts") {
        // 对于React TypeScript，使用Babel处理JSX，同时处理TypeScript
        scriptElement.type = "text/babel";
        scriptElement.setAttribute("data-type", "module");
        scriptElement.setAttribute("data-presets", "typescript,react");

        // 添加React类型声明的内联脚本
        const reactTypesScript = doc.createElement("script");
        reactTypesScript.textContent = `
          // 内联React类型声明，避免加载外部.d.ts文件
          window.React = window.React || {};
          window.ReactDOM = window.ReactDOM || {};
        `;
        // 先将reactTypesScript添加到head中
        doc.head.appendChild(reactTypesScript);

        // 然后设置scriptElement的内容并添加到body中
        scriptElement.textContent = originalCode;
      } else {
        // 对于其他TypeScript框架，使用TypeScript编译器
        const wrappedCode = `
          // 编译并执行TypeScript代码
          (function() {
            try {
              var tsResult = ts.transpileModule(${JSON.stringify(originalCode)}, tsConfig);
              eval(tsResult.outputText);
            } catch (error) {
              console.error('TypeScript编译错误:', error);
            }
          })();
        `;
        scriptElement.textContent = wrappedCode;
      }
    } else {
      // 非TypeScript框架，直接使用原始代码
      scriptElement.textContent = js;
    }

    doc.body.appendChild(scriptElement);
  }

  // 返回完整的HTML字符串，确保包含正确的DOCTYPE和字符集
  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
};

export const $ = <T extends HTMLElement>(
  selector: string,
  el: Document | HTMLElement = document
) => el.querySelector<T>(selector);

export const $$ = <T extends HTMLElement, U extends Document | HTMLElement>(
  selector: string,
  el?: U
) => {
  const elements = (el || document).querySelectorAll<T>(selector);
  if (!elements.length) {
    return [];
  }
  return elements;
};

export const createWorkerUrl = (path: string, url = import.meta.url) =>
  new URL(path, url).href;

export const openNewWindow = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * 显示加载效果
 * @param elementId 元素ID，如果不提供则显示所有编辑器的加载效果
 */
export const showLoading = (elementId?: string) => {
  if (elementId) {
    const loadingElement = $(`#${elementId}-loading`);
    if (loadingElement) {
      loadingElement.classList.add("active");
    }
  } else {
    ["html", "css", "js"].forEach((id) => {
      const loadingElement = $(`#${id}-loading`);
      if (loadingElement) {
        loadingElement.classList.add("active");
      }
    });
  }
};

/**
 * 隐藏加载效果
 * @param elementId 元素ID，如果不提供则隐藏所有编辑器的加载效果
 */
export const hideLoading = (elementId?: string) => {
  if (elementId) {
    const loadingElement = $(`#${elementId}-loading`);
    if (loadingElement) {
      loadingElement.classList.remove("active");
    }
  } else {
    ["html", "css", "js"].forEach((id) => {
      const loadingElement = $(`#${id}-loading`);
      if (loadingElement) {
        loadingElement.classList.remove("active");
      }
    });
  }
};

export const on = (
  element: HTMLElement | Document | Element | Window,
  type: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
) => {
  if (element && type && handler) {
    element.addEventListener(type, handler, useCapture);
  }
};
export const off = (
  element: HTMLElement | Document | Element | Window,
  type: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
) => {
  if (element && type && handler) {
    element.removeEventListener(type, handler, useCapture);
  }
};

export const addClass = (el: HTMLElement, ...className: string[]) => {
  return el.classList.add(...className);
};
export const removeClass = (el: HTMLElement, ...className: string[]) => {
  return el.classList.remove(...className);
};

export const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export const isString = (value: unknown): value is string =>
  typeof value === "string";
export const isBoolean = (value: any): value is boolean =>
  typeof value === "boolean";
export const handleClassName = (className?: string, status?: boolean) => {
  const condition = isBoolean(status)
    ? status
    : isString(className) && className;
  return condition ? ` ${className}` : "";
};

export const createElement = (temp: string) =>
  document.createRange().createContextualFragment(temp);

export const insertNode = (el: HTMLElement, node: Node, oldNode: Node) => {
  if (oldNode && el?.contains(oldNode)) {
    el.replaceChild(node, oldNode);
  } else {
    el?.appendChild(node);
  }
};
