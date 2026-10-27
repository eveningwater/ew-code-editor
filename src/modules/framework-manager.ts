/**
 * 框架管理模块
 */
import { defaultTemplates, frameworkCDNs } from "../const";
import { ewConfirm } from "../plugins/modal";
import { $, $$, showLoading, hideLoading } from "../utils";
import { setEditorsContent } from "./editor-manager";
import { runCode } from "./preview-manager";

// 当前选择的框架
let currentFramework = "vanilla";

// 依赖持久化存储键
const DEPENDENCY_STORAGE_KEY = "editor-dependencies";

// 默认依赖结构
const defaultDependencies: Record<string, string[]> = {
  vanilla: [],
  typescript: [],
  react: [],
  "react-ts": [],
  vue: [],
  vue3: [],
  "vue-ts": [],
  "vue3-ts": [],
};

/**
 * 从 localStorage 加载已安装依赖
 */
function loadDependencies(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(DEPENDENCY_STORAGE_KEY);
    if (stored) {
      return { ...defaultDependencies, ...JSON.parse(stored) };
    }
  } catch {
    // 解析失败时使用默认值
  }
  return { ...defaultDependencies };
}

// 已安装的依赖
let installedDependencies: Record<string, string[]> = loadDependencies();

/**
 * 持久化依赖到 localStorage
 */
function persistDependencies() {
  localStorage.setItem(
    DEPENDENCY_STORAGE_KEY,
    JSON.stringify(installedDependencies)
  );
}

/**
 * 解析包名和版本号，兼容 scoped 包（如 @scope/pkg@1.0.0）
 */
export function parsePackageName(pkg: string): [string, string] {
  const atIndex = pkg.lastIndexOf("@");
  if (atIndex > 0) {
    return [pkg.slice(0, atIndex), pkg.slice(atIndex + 1)];
  }
  return [pkg, ""];
}

/**
 * 获取当前框架
 */
export function getCurrentFramework() {
  return currentFramework;
}

/**
 * 更新框架
 * @param framework 框架名称
 */
export function updateFramework(framework: string) {
  if (framework === currentFramework) return;
  
  // 切换框架
  currentFramework = framework;

  // 加载新框架的模板代码
  const template = defaultTemplates[framework as keyof typeof defaultTemplates];
  if (template) {
    setEditorsContent([
      { type: "html", content: template.html },
      { type: "css", content: template.css },
      { type: "js", content: template.js },
    ]);
  }

  // 更新JavaScript编辑器的语言模式
  import("./editor-manager").then(({ updateJsEditorLanguage, showTypeScriptErrors }) => {
    // 延迟更新语言模式，确保内容已设置
    setTimeout(() => {
      if (updateJsEditorLanguage) {
        updateJsEditorLanguage(framework);
      }
      
      // 如果是TypeScript框架，延迟检查错误
      if (framework.includes("ts") || framework === "typescript") {
        setTimeout(() => {
          if (showTypeScriptErrors) {
            showTypeScriptErrors();
          }
        }, 1000);
      }
    }, 200);
  });

  // 更新UI
  updateFrameworkUI();
}

/**
 * 更新框架UI
 */
function updateFrameworkUI() {
  // 更新框架选择下拉菜单
  $$("a[data-framework]").forEach((item) => {
    const framework = item.getAttribute("data-framework");
    if (framework === currentFramework) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

/**
 * 显示依赖管理面板
 */
export function showDependencyManager() {
  $("#dependency-manager")?.classList.add("show");
  updateDependencyList();
}

/**
 * 隐藏依赖管理面板
 */
export function hideDependencyManager() {
  $("#dependency-manager")?.classList.remove("show");
}

/**
 * 添加依赖
 * @param packageName 包名
 */
export function addDependency(packageName: string) {
  if (!packageName) return;

  // 确保当前框架的依赖数组存在
  if (!installedDependencies[currentFramework]) {
    installedDependencies[currentFramework] = [];
  }

  // 检查依赖是否已存在
  if (installedDependencies[currentFramework]!.includes(packageName)) {
    ewConfirm({
      title: "提示",
      content: `Package ${packageName} is already installed.`,
      sureText: "确定",
    });
    return;
  }

  // 显示加载效果
  showLoading("dependency");

  // 模拟安装依赖的过程
  setTimeout(() => {
    // 添加到已安装依赖列表
    installedDependencies[currentFramework]!.push(packageName);
    persistDependencies();

    // 更新依赖列表UI
    updateDependencyList();

    // 清空输入框
    const input = $("#dependency-input") as HTMLInputElement;
    if (input) input.value = "";

    // 隐藏加载效果
    hideLoading("dependency");

    // 运行代码以应用新依赖
    runCode();
  }, 1000);
}

/**
 * 移除依赖
 * @param packageName 包名
 */
export function removeDependency(packageName: string) {
  // 确保当前框架的依赖数组存在
  if (!installedDependencies[currentFramework]) {
    installedDependencies[currentFramework] = [];
  }

  // 从已安装依赖列表中移除
  installedDependencies[currentFramework] = installedDependencies[
    currentFramework
  ]!.filter((pkg) => pkg !== packageName);
  persistDependencies();

  // 更新依赖列表UI
  updateDependencyList();

  // 运行代码以应用变更
  runCode();
}

/**
 * 更新依赖列表UI
 */
function updateDependencyList() {
  const dependencyList = $("#dependency-list");
  if (!dependencyList) return;

  // 确保当前框架的依赖数组存在
  if (!installedDependencies[currentFramework]) {
    installedDependencies[currentFramework] = [];
  }

  // 清空列表
  dependencyList.innerHTML = "";

  // 添加已安装的依赖
  installedDependencies[currentFramework]!.forEach((pkg) => {
    const item = document.createElement("div");
    item.className = "dependency-item";
    item.innerHTML = `
      <span>${pkg}</span>
      <span class="remove-btn" data-package="${pkg}">×</span>
    `;
    dependencyList.appendChild(item);

    // 添加移除按钮事件
    const removeBtn = item.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        removeDependency(pkg);
      });
    }
  });
}

/**
 * 获取当前框架的CDN链接
 */
export function getFrameworkCDNs() {
  return frameworkCDNs[currentFramework as keyof typeof frameworkCDNs] || [];
}

/**
 * 获取已安装依赖的CDN链接（仅处理需要UMD全局构建的特殊包，如antd）
 */
export function getDependencyCDNs() {
  // 确保当前框架的依赖数组存在
  if (!installedDependencies[currentFramework]) {
    installedDependencies[currentFramework] = [];
  }

  return installedDependencies[currentFramework]!
    .filter((pkg) => pkg.startsWith("antd"))
    .map((pkg) => {
      // antd 使用 UMD 版本 + 样式文件
      const [name, version] = parsePackageName(pkg);
      const ver = version || "latest";
      return [
        `https://cdn.jsdelivr.net/npm/${name}@${ver}/dist/antd.min.js`,
        `https://cdn.jsdelivr.net/npm/${name}@${ver}/dist/antd.min.css`,
      ];
    })
    .flat(); // 使用flat()将嵌套数组展平
}

/**
 * 获取已安装依赖的 import map 映射（esm.sh ESM CDN）
 * 配合 <script type="importmap"> 使用户代码可直接 import npm 包
 */
export function getDependencyImportMap(): Record<string, string> {
  const importMap: Record<string, string> = {};

  // vue3 模板使用 import 语法，需要框架自身的 ESM 映射
  if (currentFramework === "vue3" || currentFramework === "vue3-ts") {
    importMap["vue"] = "https://esm.sh/vue@3.3.4";
  }

  const deps = installedDependencies[currentFramework] || [];
  deps.forEach((pkg) => {
    // antd 等 UMD 包走 script 标签，不进 import map
    if (pkg.startsWith("antd")) return;
    const [name, version] = parsePackageName(pkg);
    importMap[name] = version
      ? `https://esm.sh/${name}@${version}`
      : `https://esm.sh/${name}`;
  });

  return importMap;
}

/**
 * 设置事件监听
 */
export function setupFrameworkEvents() {
  // 安装依赖按钮
  $("#install-btn")?.addEventListener("click", () => {
    const input = $("#dependency-input") as HTMLInputElement;
    if (input && input.value.trim()) {
      addDependency(input.value.trim());
    }
  });

  // 依赖输入框回车事件
  $("#dependency-input")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (input.value.trim()) {
        addDependency(input.value.trim());
      }
    }
  });

  // 关闭依赖管理面板按钮
  $("#close-dependency-btn")?.addEventListener("click", hideDependencyManager);
}
