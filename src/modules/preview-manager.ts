import { generateCombinedCode, openNewWindow, $ } from "../utils";
import { getEditorsCode } from "./editor-manager";
import { getCurrentFramework } from "./framework-manager";

/**
 * 运行代码
 */
export function runCode() {
  const { html, css, js } = getEditorsCode();
  // 合并代码
  const combinedCode = generateCombinedCode(html, css, js);
  const iframe = $<HTMLIFrameElement>("#preview-frame");

  // 解决不释放iframe内容，导致报错Identifier 'xxx' has already been declared
  iframe.srcdoc = "about:blank"; // 重置 iframe 内容
  iframe.srcdoc = combinedCode;
}

/**
 * 下载代码
 */
export function downloadCode() {
  const { html, css, js } = getEditorsCode();
  const currentFramework = getCurrentFramework();

  // 合并代码
  const combinedCode = generateCombinedCode(html, css, js);

  // 创建Blob对象时指定正确的MIME类型和编码
  const blob = new Blob([combinedCode], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `code-editor-export-${currentFramework}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 在新窗口中预览代码
 */
export function openInNewWindow() {
  const { html, css, js } = getEditorsCode();

  // 合并代码
  const combinedCode = generateCombinedCode(html, css, js);

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
