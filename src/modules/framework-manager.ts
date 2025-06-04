/**
 * 框架管理模块
 */
import { defaultTemplates, frameworkCDNs } from "../const";
import { $, $$, showLoading, hideLoading } from "../utils";
import { getEditorsCode, setEditorsContent } from "./editor-manager";
import { runCode } from "./preview-manager";

// 当前选择的框架
let currentFramework = "vanilla";

// 已安装的依赖
let installedDependencies: Record<string, string[]> = {
  vanilla: [],
  react: [],
  vue: [],
};

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

  // 保存当前代码
  const currentCode = getEditorsCode();

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

  // 检查依赖是否已存在
  if (installedDependencies[currentFramework].includes(packageName)) {
    alert(`Package ${packageName} is already installed.`);
    return;
  }

  // 显示加载效果
  showLoading("dependency");

  // 模拟安装依赖的过程
  setTimeout(() => {
    // 添加到已安装依赖列表
    installedDependencies[currentFramework].push(packageName);

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
  // 从已安装依赖列表中移除
  installedDependencies[currentFramework] = installedDependencies[
    currentFramework
  ].filter((pkg) => pkg !== packageName);

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

  // 清空列表
  dependencyList.innerHTML = "";

  // 添加已安装的依赖
  installedDependencies[currentFramework].forEach((pkg) => {
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
 * 获取已安装依赖的CDN链接
 */
export function getDependencyCDNs() {
  return installedDependencies[currentFramework]
    .map((pkg) => {
      // 特殊处理某些需要特定CDN格式的包
      if (pkg.startsWith("antd")) {
        // 对于antd，使用UMD版本
        const [name, version] = pkg.split("@");
        const ver = version || "latest";
        return [
          `https://unpkg.com/${name}@${ver}/dist/antd.min.js`,
          `https://unpkg.com/${name}@${ver}/dist/antd.min.css`,
        ];
      }

      // 默认处理方式
      const [name, version] = pkg.split("@");
      return version
        ? `https://unpkg.com/${name}@${version}`
        : `https://unpkg.com/${name}`;
    })
    .flat(); // 使用flat()将嵌套数组展平
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
