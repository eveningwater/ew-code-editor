/**
 * 配置管理模块
 */

import { updateEditorsTheme } from "./editor-manager";
import { updateFramework } from "./framework-manager";

// 配置类型
export interface EditorConfig {
  theme: string;
  layout: string;
  language: string;
  framework: string;
}

// 默认配置
const defaultConfig: EditorConfig = {
  theme: "vs-dark",
  layout: "horizontal",
  language: "zh",
  framework: "vanilla",
};

// 当前配置
let currentConfig: EditorConfig = {
  ...defaultConfig,
  language: localStorage.getItem("editor-language") || defaultConfig.language,
  framework: localStorage.getItem("editor-framework") || defaultConfig.framework,
};

/**
 * 获取当前配置
 */
export function getConfig(): EditorConfig {
  return { ...currentConfig };
}

/**
 * 更新主题配置
 * @param theme 主题名称
 */
export function updateTheme(theme: string) {
  currentConfig.theme = theme;
  updateEditorsTheme(currentConfig.theme);
  document.body.setAttribute("data-theme", theme);
}

/**
 * 更新布局配置
 * @param layout 布局类型
 */
export function updateLayout(layout: string) {
  currentConfig.layout = layout;
}

/**
 * 更新语言配置
 * @param language 语言
 */
export function updateLanguage(language: string) {
  currentConfig.language = language;
  localStorage.setItem("editor-language", language);
}

/**
 * 更新框架配置
 * @param framework 框架名称
 */
export function updateFrameworkConfig(framework: string) {
  currentConfig.framework = framework;
  localStorage.setItem("editor-framework", framework);
  updateFramework(framework);
}
