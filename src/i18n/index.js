import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    title: 'Souls Start Randomizer',
    ds1: 'Dark Souls',
    ds2: 'Dark Souls II',
    ds3: 'Dark Souls III',
    eldenRing: 'Elden Ring',
    randomize: 'Randomize',
    loading: 'Randomizing...',
    selectGame: 'Select Game Version',
    noSelection: 'Click the button above to randomize your starting class and gift',
    clickRandomize: 'Click the button above to randomize your starting class and gift',
    class: 'Class',
    gift: 'Gift',
    sound_effects: 'Sound Effects'
  },
  ru: {
    title: 'Souls Start Randomizer',
    ds1: 'Dark Souls',
    ds2: 'Dark Souls II',
    ds3: 'Dark Souls III',
    eldenRing: 'Elden Ring',
    randomize: 'Рандомизировать',
    loading: 'Рандомизация...',
    selectGame: 'Выберите версию игры',
    noSelection: 'Нажмите кнопку выше, чтобы рандомизировать начальный класс и подарок',
    clickRandomize: 'Нажмите кнопку выше, чтобы рандомизировать начальный класс и подарок',
    class: 'Класс',
    gift: 'Дар',
    sound_effects: 'Звуковые эффекты'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages
})