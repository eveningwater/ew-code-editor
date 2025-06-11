import Split from "split.js";
import { $ } from "../utils";
import { notifyEditorLayoutChange } from "./editor-manager";

// 布局实例
let splitInstance: Split.Instance;

/**
 * 布局类型
 */
export type LayoutType =
  | "horizontal"
  | "vertical"
  | "preview-right"
  | "preview-bottom";

/**
 * 初始化布局
 * @param layout 布局类型
 */
export function initLayout(layout: LayoutType) {
  const main = $("main")!;

  // 移除之前的split实例
  if (splitInstance) {
    splitInstance.destroy();
  }

  // 移除所有布局类名
  main.classList.remove(
    "horizontal",
    "vertical",
    "preview-right",
    "preview-bottom"
  );

  // 根据布局设置方向和大小
  switch (layout) {
    case "horizontal":
      main.classList.add("horizontal");
      splitInstance = Split(["#editor-container", "#preview-container"], {
        direction: "horizontal",
        sizes: [50, 50],
        minSize: 200,
        gutterSize: 8,
      });
      break;
    case "vertical":
      main.classList.add("vertical");
      splitInstance = Split(["#editor-container", "#preview-container"], {
        direction: "vertical",
        sizes: [50, 50],
        minSize: 100,
        gutterSize: 8,
      });
      break;
    case "preview-right":
      main.classList.add("preview-right");
      splitInstance = Split(["#editor-container", "#preview-container"], {
        direction: "horizontal",
        sizes: [70, 30],
        minSize: 200,
        gutterSize: 8,
      });
      break;
    case "preview-bottom":
      main.classList.add("preview-bottom");
      splitInstance = Split(["#editor-container", "#preview-container"], {
        direction: "vertical",
        sizes: [70, 30],
        minSize: 100,
        gutterSize: 8,
      });
      break;
  }

  // 通知编辑器布局已更改
  notifyEditorLayoutChange();
}
