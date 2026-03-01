import { toast } from 'react-toastify';
import i18n from '../i18n';

const t = i18n.t.bind(i18n);

export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

// Уведомления для каналов
export const notifyChannelCreated = () => {
  showSuccess(t('toasts.channelCreated'));
};

export const notifyChannelRenamed = () => {
  showSuccess(t('toasts.channelRenamed'));
};

export const notifyChannelRemoved = () => {
  showSuccess(t('toasts.channelRemoved'));
};

// Уведомления для ошибок
export const notifyNetworkError = () => {
  showError(t('toasts.networkError'));
};

export const notifyLoadError = () => {
  showError(t('toasts.loadError'));
};

export const notifyConnectionStatus = (isConnected) => {
  if (isConnected) {
    showInfo(t('toasts.reconnected'));
  } else {
    showWarning(t('toasts.disconnected'));
  }
};
