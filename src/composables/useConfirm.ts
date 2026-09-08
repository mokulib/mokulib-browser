import { usePopupStore } from "@/stores/popup.ts";

export interface ConfirmOptions {
  title?: string;
  description?: string;
  message?: string;
  button?: string;
  type?: 'default' | 'danger';
}

export function useConfirm() {
  const popupStore = usePopupStore();

  /**
   * 显示确认弹窗
   * @param options 确认弹窗配置
   * @returns Promise<boolean> 用户是否确认
   */
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      popupStore.open('confirm', {
        title: options.title || '确认',
        description: options.description,
        message: options.message,
        button: options.button || '确认',
        type: options.type || 'default'
      }, (confirmed: boolean) => {
        resolve(confirmed);
      });
    });
  };

  return {
    confirm
  };
}