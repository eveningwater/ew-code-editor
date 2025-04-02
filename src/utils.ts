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

  // 添加CSS
  if (css.trim()) {
    const styleElement = doc.createElement("style");
    styleElement.textContent = css;
    doc.head.appendChild(styleElement);
  }

  // 添加JavaScript
  if (js.trim()) {
    const scriptElement = doc.createElement("script");
    scriptElement.textContent = js;
    doc.body.appendChild(scriptElement);
  }

  // 返回完整的HTML字符串，确保包含正确的DOCTYPE和字符集
  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
};

export const createElement = (temp: string) =>
  document.createRange().createContextualFragment(temp);

export const $ = <T extends HTMLElement>(selector: string) => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Element not found: ${selector}`);
  return element;
};

export const $$ = <T extends HTMLElement>(selector: string) => {
  const elements = document.querySelectorAll<T>(selector);
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
