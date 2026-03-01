import filter from 'leo-profanity';

// Загружаем русский словарь
filter.loadDictionary('ru');

const profanityFilter = {
  // Очистка текста (замена плохих слов на ***)
  clean: (text) => {
    if (typeof text !== 'string') return text;
    
    // Используем встроенный метод clean, который заменяет каждое плохое слово на ***
    return filter.clean(text);
  },

  // Проверка на наличие нецензурных слов
  isProfane: (text) => {
    if (typeof text !== 'string') return false;
    return filter.check(text);
  },

  // Добавление своих слов
  addWords: (words) => words.forEach(word => filter.add(word)),

  // Удаление слов из фильтра
  removeWords: (words) => words.forEach(word => filter.remove(word)),
};

export default profanityFilter;