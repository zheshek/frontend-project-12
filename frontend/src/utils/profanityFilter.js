import filter from 'leo-profanity'

filter.loadDictionary('en')
filter.loadDictionary('ru')

filter.add(['fuck', 'shit', 'bitch', 'asshole', 'damn', 'cunt', 'boobs'])

const profanityFilter = {
  clean: text => {
    if (typeof text !== 'string' || !text.trim()) {
      return text
    }

    return filter.clean(text)
  },

  isProfane: text => {
    if (typeof text !== 'string') {
      return false
    }

    return filter.check(text)
  },
}

export default profanityFilter
