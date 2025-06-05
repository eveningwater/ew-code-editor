import createPopBox from "./modal";
export interface PopBoxOptions {
  title?: string;
  content: string;
  sure?: (i?: InstanceType<typeof createPopBox>, e?: Event) => void;
  cancel?: (i?: InstanceType<typeof createPopBox>, e?: Event) => void;
  afterClose?: (i?: InstanceType<typeof createPopBox>, e?: Event) => void;
  showCancel?: boolean;
  isClickModal?: boolean;
  closeTime?: number;
  align?: "left" | "center" | "right";
  cancelText?: string;
  sureText?: string;
  container?: HTMLElement;
  showClose?: boolean;
  rootClassName?: string;
  footer?: string;
}
