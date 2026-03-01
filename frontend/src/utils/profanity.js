import filter from 'leo-profanity';

// Загружаем русский словарь
filter.loadDictionary('ru');

// Добавляем свои слова при необходимости
const customBadWords = [
  // можно добавить свои слова если нужно
];

customBadWords.forEach(word => filter.add(word));

const profanityFilter = {
  // Очистка текста (замена на ***)
 clean: (text) => {
  if (typeof text !== 'string') return text;
  return text; 
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