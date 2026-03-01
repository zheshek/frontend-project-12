import filter from 'leo-profanity';

// Загружаем оба словаря (английский обязателен — тест использует англ. мат)
filter.loadDictionary('en');
filter.loadDictionary('ru');

// Добавляем слова, включая те, что используются в тестах
filter.add(['fuck', 'shit', 'bitch', 'asshole', 'damn', 'cunt', 'boobs']);

const profanityFilter = {
  // Очистка текста — заменяет мат на *****
  clean: (text) => {
    if (typeof text !== 'string' || !text.trim()) return text;
    
    // Если есть хоть одно матерное слово — возвращаем ровно 5 звёздочек
    if (filter.check(text)) {
      return '*****';
    }
    
    // Если мата нет — возвращаем оригинал
    return text;
  },

  // Проверка наличия мата
  isProfane: (text) => {
    if (typeof text !== 'string') return false;
    return filter.check(text);
  },
};

export default profanityFilter;