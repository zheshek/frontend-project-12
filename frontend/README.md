# 📱 Hexlet Chat (Slack-like Chat)

[![Actions Status](https://github.com/zheshek/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/zheshek/frontend-project-12/actions)

Упрощенный аналог Slack-чата для командного общения. Проект создан в учебных целях для демонстрации навыков работы с современными веб-технологиями.

## 🚀 Демо

Приложение доступно по ссылке: [https://frontend-project-12.onrender.com](https://frontend-project-12.onrender.com)

## 📋 Описание

Проект представляет собой real-time чат с возможностью:

- 🔐 Регистрации и авторизации пользователей (JWT)
- 💬 Создания, переименования и удаления каналов
- 📨 Обмена сообщениями в реальном времени (WebSocket)
- 🚫 Фильтрации нецензурных слов
- 🔔 Всплывающих уведомлений о действиях
- 🌐 Интернационализации (русский язык)
- 📱 Адаптивного дизайна

## 🛠 Технологии

### Frontend

- **React 18** - библиотека для пользовательских интерфейсов
- **Redux Toolkit** - управление состоянием
- **React Router v6** - навигация
- **React Bootstrap** - UI компоненты
- **Formik + Yup** - формы и валидация
- **Socket.IO-client** - WebSocket соединения
- **i18next** - интернационализация
- **Axios** - HTTP запросы
- **Vite** - сборка проекта

### Backend

- **@hexlet/chat-server** - готовый сервер на Express + Socket.IO
- **JWT** - аутентификация

### Мониторинг

- **Rollbar** - отслеживание ошибок в продакшене

## ⚙️ Установка и запуск

### Требования

- Node.js 18 или выше
- npm 8 или выше

### Локальная разработка

```bash
# Клонирование репозитория
git clone https://github.com/zheshek/frontend-project-12.git
cd frontend-project-12

# Установка зависимостей
make install

# Сборка проекта
make build

# Запуск сервера (продакшен)
make start

# Режим разработки (сервер + фронтенд с hot reload)
make dev
```
