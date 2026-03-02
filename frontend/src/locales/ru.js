export default {
  translation: {
    // Общие
    appName: 'Hexlet Chat',
    loading: 'Загрузка...',
    send: 'Отправить',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    add: '+',
    edit: 'Редактировать',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    back: 'Назад',

    // Навигация
    header: {
      logout: 'Выйти',
      login: 'Войти',
      online: 'Online',
      offline: 'Offline',
      connectionError: 'Ошибка соединения',
    },

    // Авторизация
    auth: {
      login: 'Вход',
      signup: 'Регистрация',
      loginUsername: 'Ваш ник',
      signupUsername: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      loginButton: 'Войти',
      signupButton: 'Зарегистрироваться',
      loggingIn: 'Вход...',
      signingUp: 'Регистрация...',
      errors: {
        required: 'Обязательное поле',
        usernameLength: 'От 3 до 20 символов',
        passwordLength: 'Не менее 6 символов',
        passwordsMustMatch: 'Пароли должны совпадать',
        invalidCredentials: 'Неверные имя пользователя или пароль',
        userExists: 'Такой пользователь уже существует',
        serverError: 'Ошибка сервера',
      },
    },

    // Каналы
    channels: {
      title: 'Каналы',
      add: 'Добавить канал',
      rename: 'Переименовать канал',
      remove: 'Удалить канал',
      channelName: 'Имя канала',
      newChannelName: 'Новое имя канала',
      channelCreated: 'Канал создан',
      channelRenamed: 'Канал переименован',
      channelRemoved: 'Канал удалён',
      confirmRemove: 'Вы уверены, что хотите удалить канал',
      messagesWillBeDeleted: 'Все сообщения в этом канале будут удалены!',
      errors: {
        required: 'Обязательное поле',
        nameLength: 'От 3 до 20 символов',
        nameExists: 'Канал с таким именем уже существует',
      },
    },

    // Сообщения
    messages: {
      typeMessage: 'Введите сообщение...',
      sending: 'Отправка...',
      noMessages: 'Нет сообщений в этом канале',
      beFirst: 'Напишите первое сообщение!',
      user: 'Пользователь',
      justNow: 'только что',
    },

    toasts: {
      channelCreated: 'Канал создан',
      channelRenamed: 'Канал переименован',
      channelRemoved: 'Канал успешно удален',
      networkError: 'Ошибка сети. Проверьте подключение',
      loadError: 'Ошибка загрузки данных',
      disconnected: 'Нет соединения с сервером',
      reconnected: 'Соединение восстановлено',
      loginSuccess: 'Добро пожаловать!',
      signupSuccess: 'Регистрация успешна!',
      logout: 'До встречи!',
    },

    // Ошибки
    errors: {
      networkError: 'Ошибка сети. Проверьте подключение.',
      unknownError: 'Неизвестная ошибка',
      unauthorized: 'Неавторизованный доступ',
      pageNotFound: 'Страница не найдена',
      goHome: 'Вернуться на главную',
    },

    profanity: {
      channelNameError: 'Название канала содержит недопустимые слова',
      messageFiltered: 'Сообщение отфильтровано',
    },

    // Модальные окна
    modals: {
      addChannel: {
        title: 'Добавить новый канал',
      },
      renameChannel: {
        title: 'Переименовать канал',
      },
      removeChannel: {
        title: 'Удаление канала',
      },
    },
  },
}
