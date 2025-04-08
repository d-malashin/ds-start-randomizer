import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    title: 'Dark Souls',
    subtitle: 'Start Randomizer',
    selectGame: 'Select Game Version',
    games: {
      ds1: 'Dark Souls',
      ds2: 'Dark Souls II',
      ds3: 'Dark Souls III'
    },
    randomize: 'Randomize',
    selectedClass: 'Selected Class',
    selectedGift: 'Selected Gift',
    clickRandomize: 'Click "Randomize" to get your starting class and gift'
  },
  ru: {
    title: 'Dark Souls',
    subtitle: 'Рандомизатор старта',
    selectGame: 'Выберите версию игры',
    games: {
      ds1: 'Dark Souls',
      ds2: 'Dark Souls II',
      ds3: 'Dark Souls III'
    },
    randomize: 'Рандомизировать',
    selectedClass: 'Выбранный класс',
    selectedGift: 'Выбранный дар',
    clickRandomize: 'Нажмите "Рандомизировать" чтобы получить начальный класс и дар'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages
})