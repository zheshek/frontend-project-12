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

// Уведомления для каналов
export const notifyChannelCreated = () => {
  showSuccess('Канал создан');
};

export const notifyChannelRenamed = () => {
  showSuccess('Канал переименован');
};

export const notifyChannelRemoved = () => {
  showSuccess('Канал удалён');  // ← Прямой текст
};

// Остальные функции
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