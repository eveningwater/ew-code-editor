import { closeIcon } from "../const";
import {
  $,
  addClass,
  createElement,
  handleClassName,
  insertNode,
  isObject,
  isString,
  on,
  removeClass,
} from "../utils";
import { PopBoxOptions } from "./confirm.d";

const defaultCloseTime = 600;
export default class createPopBox {
  config: PopBoxOptions;
  defaultConfig: PopBoxOptions = {
    title: "提示",
    content: "默认内容",
    sure: () => this.close(defaultCloseTime),
    cancel: () => this.close(defaultCloseTime),
    showCancel: false,
    closeTime: defaultCloseTime,
    isClickModal: true,
    sureText: "确认",
    container: document.body,
    showClose: true,
  };
  $el: HTMLElement | null = null;
  constructor(options: string | PopBoxOptions) {
    this.config = this.defaultConfig;
    if (isString(options)) {
      this.config.content = <string>options;
    } else if (isObject(options)) {
      this.config = Object.assign(this.config, <PopBoxOptions>options);
    }
    this.render();
    this.renderStyle();
  }
  renderStyle() {
    const { align = "right" } = this.config;
    const style = document.createElement("style");
    style.id = "ew-pop-box-style";
    style.textContent = `
            .ew-pop-box {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 2000;
                transition: all 0.3s;
            }
            .ew-pop-box.${align}, .ew-pop-box.${align} .ew-pop-box-footer {
                text-align: ${align};
            }
            /* 显示 */
            .ew-pop-box.show {
              transform: scale(1);
              opacity: 1;
            }
            /* 隐藏 */
            .ew-pop-box.hidden {
              transform: scale(0);
              opacity: 0;
            }
            /* 遮罩层样式 */
            .ew-pop-box-mask {
              position: fixed;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.2);
              z-index: 2001;
              transition: all 0.6s;
            }
            .ew-pop-box-title {
              padding: 8px 9px;
              font-weight: 500;
              font-size: 18px;
              position: relative;
            }
            .ew-pop-box-title-close-btn {
              width: 20px;
              height: 20px;
              position: absolute;
              right: 8px;
              top: 8px;
              cursor: pointer;
              transition: all 0.1s;
            }
            .ew-pop-box-title-close-btn:hover {
              opacity: 0.5;
            }
            .ew-pop-box-wrapper {
              min-width: 300px;
              min-height: 80px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              border-radius: 5px;
              z-index: 2002;
              background-color: #fff;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .ew-pop-box-content {
                word-break: break-all;
                 padding: 20px;
                 font-size: 15px;
                 line-height: 25px;
                 background-color: #fff;
                 color: #333;
             }
             
             /* 暗色主题适配 */
             body[data-theme="vs-dark"] .ew-pop-box-content,
             body[data-theme="hc-black"] .ew-pop-box-content {
                 background-color: #252526;
                 color: #eee;
             }
             
             .ew-pop-box-footer {
              padding: 8px 10px;
            }
            .ew-pop-box-footer-btn {
              outline: none;
              letter-spacing: 2px;
              display: inline-block;
              line-height: 1;
              white-space: nowrap;
              background: #fff;
              border: 1px solid #dcdfe6;
              color: #606266;
              -webkit-appearance: none;
              transition: 0.1s;
              font-weight: 500;
              -moz-user-select: none;
              -webkit-user-select: none;
              -ms-user-select: none;
              padding: 12px 20px;
              font-size: 14px;
              border-radius: 4px;
              cursor: pointer;
            }
            .ew-pop-box-footer-btn:hover,
            .ew-pop-box-footer-btn:active {
              color: #57a3f3;
              background-color: #fff;
              border-color: #57a3f3;
            }
            .ew-pop-box-footer-sure-btn {
              color: #fff;
              background-color: #409eff;
              border-color: #409eff;
            }
            .ew-pop-box-footer-btn.ew-pop-box-footer-sure-btn:hover,
            .ew-pop-box-footer-btn.ew-pop-box-footer-sure-btn:active {
              background: #66b1ff;
              border-color: #66b1ff;
              color: #fff;
            }
            
            /* 暗色主题适配 */
            body[data-theme="vs-dark"] .ew-pop-box-wrapper,
            body[data-theme="hc-black"] .ew-pop-box-wrapper {
                background-color: #252526;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            }`;
    const head = <HTMLHeadElement>$("head");
    const existStyleElement = $("#ew-pop-box-style", head);
    insertNode(head, style, existStyleElement!);
  }
  render() {
    const {
      title: defaultTitle,
      sureText: defaultSureText,
      showCancel: defaultShowCancel,
      showClose: defaultShowClose,
      content: defaultContent,
      container: defaultContainer,
      isClickModal: defaultIsClickModal,
      closeTime: defaultCloseTime,
      sure: defaultSure,
      cancel: defaultCancel,
    } = this.defaultConfig;
    const {
      title = defaultTitle,
      isClickModal = defaultIsClickModal,
      content = defaultContent,
      sureText = defaultSureText,
      cancelText = "取消",
      showCancel = defaultShowCancel,
      showClose = defaultShowClose,
      container = defaultContainer,
      closeTime = defaultCloseTime,
      sure = defaultSure,
      cancel = defaultCancel,
      align,
      rootClassName,
      footer,
    } = this.config;
    const renderTemplate = createElement(`
            <div class="ew-pop-box hidden${handleClassName(
              align
            )}${handleClassName(rootClassName)}">
                <div class="ew-pop-box-mask"></div>
                <div class="ew-pop-box-wrapper">
                    ${
                      title
                        ? `<div class="ew-pop-box-title">
                            ${title}
                            ${
                              showClose
                                ? `<span class="ew-pop-box-title-close-btn">${closeIcon()}</span>`
                                : ""
                            }
                        </div>`
                        : ""
                    }
                    <div class="ew-pop-box-content">${content}</div>
                    ${
                      isString(footer)
                        ? footer
                        : `<div class="ew-pop-box-footer">
                      <button class="ew-pop-box-footer-btn ew-pop-box-footer-sure-btn" type="button">${sureText}</button>
                      ${
                        showCancel
                          ? `<button class="ew-pop-box-footer-btn ew-pop-box-footer-cancel-btn" type="button">${cancelText}</button>`
                          : ""
                      }</div>`
                    }
                </div>
            </div>
        `);
    const existPopboxElement = $(".ew-pop-box", container);
    insertNode(container!, renderTemplate, existPopboxElement!);
    this.$el = $(".ew-pop-box", container) as HTMLElement;
    //  判断如果展示标题和关闭按钮或者允许点击遮罩层关闭
    if ((title && showClose) || isClickModal) {
      // 为弹出框容器元素绑定事件
      on(this.$el!, "click", (e) => {
        // 获取当前点击的目标元素，断言是一个html元素
        const target = e.target as HTMLElement;
        // 获取当前元素的className
        const baseClassName = target?.className;
        // 获取父元素的className,如果点击的是svg元素
        const clickedSvgClassName = target?.parentElement?.className;
        // 获取父元素的父元素的className,如果点击的是path元素
        const clickedSvgPathClassName =
          target?.parentElement?.parentElement?.className;
        const className = isString(baseClassName)
          ? baseClassName
          : isString(clickedSvgClassName)
            ? clickedSvgClassName
            : isString(clickedSvgPathClassName)
              ? clickedSvgPathClassName
              : "";

        //  判断目标元素存在并且存在className属性
        if (
          (className?.includes("ew-pop-box-mask") && isClickModal) ||
          className?.includes("ew-pop-box-title-close-btn")
        ) {
          // 调用关闭方法关闭抽屉，并回调一个方法将事件对象当作参数回调出去
          this.close(closeTime);
        }
      });
    }

    on(
      <HTMLElement>$(".ew-pop-box-footer-sure-btn", this.$el),
      "click",
      (e) => {
        sure?.(this, e);
      }
    );
    on(
      <HTMLElement>$(".ew-pop-box-footer-cancel-btn", this.$el),
      "click",
      (e) => {
        cancel?.(this, e);
      }
    );
    this.open(0);
  }
  baseToggle(status: boolean, time?: number) {
    //  从配置对象中获取关闭时间，这也是我们设计的参数
    const { closeTime } = this.config;
    setTimeout(() => {
      addClass(this.$el!, status ? "show" : "hidden");
      removeClass(this.$el!, status ? "hidden" : "show");
    }, time || closeTime);
  }

  async close(time?: number) {
    this.baseToggle(false, time);
  }
  open(time?: number) {
    this.baseToggle(true, time);
  }
}

export const ewConfirm = (options: PopBoxOptions | string) =>
  new createPopBox(options);

export type ConfirmInstance = ReturnType<typeof ewConfirm>;
