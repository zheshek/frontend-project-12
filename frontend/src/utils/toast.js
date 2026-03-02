import { toast } from 'react-toastify'
import i18n from '../i18n'

const t = i18n.t.bind(i18n)

// Оставляем базовые функции
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
  })
}

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
  })
}

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
  })
}

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
  })
}

// Уведомления для каналов - с прямым текстом
export const notifyChannelCreated = () => {
  showSuccess('Канал создан')
}

export const notifyChannelRenamed = () => {
  showSuccess('Канал переименован')
}

export const notifyChannelRemoved = () => {
  showSuccess('Канал удалён')
}

// Уведомления для ошибок
export const notifyNetworkError = () => {
  showError(t('toasts.networkError'))
}

export const notifyLoadError = () => {
  showError(t('toasts.loadError'))
}

export const notifyConnectionStatus = (isConnected) => {
  if (isConnected) {
    showInfo(t('toasts.reconnected'))
  } else {
    showWarning(t('toasts.disconnected'))
  }
}