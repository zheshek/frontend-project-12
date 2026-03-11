import { toast } from 'react-toastify'
import i18n from '../i18n'

const t = i18n.t.bind(i18n)

const defaultOptions = {
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
}

export const showSuccess = (message) => {
  toast.success(message, {
    ...defaultOptions,
    autoClose: 3000,
  })
}

export const showError = (message) => {
  toast.error(message, {
    ...defaultOptions,
    autoClose: 5000,
  })
}

export const showInfo = (message) => {
  toast.info(message, {
    ...defaultOptions,
    autoClose: 3000,
  })
}

export const showWarning = (message) => {
  toast.warning(message, {
    ...defaultOptions,
    autoClose: 4000,
  })
}

export const notifyChannelCreated = () => {
  showSuccess('Канал создан')
}

export const notifyChannelRenamed = () => {
  showSuccess('Канал переименован')
}

export const notifyChannelRemoved = () => {
  showSuccess('Канал удалён')
}

export const notifyNetworkError = () => {
  showError(t('toasts.networkError'))
}

export const notifyLoadError = () => {
  showError(t('toasts.loadError'))
}

export const notifyConnectionStatus = (isConnected) => {
  if (isConnected) {
    showInfo(t('toasts.reconnected'))
  }
  else {
    showWarning(t('toasts.disconnected'))
  }
}
