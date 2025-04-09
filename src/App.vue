<template>
  <div class="app" :style="{ background: backgroundColor, backgroundImage: backgroundImage }">
    <!-- Preload background images -->
    <div style="display: none;">
      <img :src="ds1Bg" alt=""/>
      <img :src="ds2Bg" alt=""/>
      <img :src="ds3Bg" alt=""/>
    </div>

    <div class="container">
      <h1 class="title">{{ t('title') }}</h1>

      <div class="language-selector">
        <button
          @click="toggleLanguage"
          :class="{ active: currentLanguage === 'en' }"
        >
          EN
        </button>
        <button
          @click="toggleLanguage"
          :class="{ active: currentLanguage === 'ru' }"
        >
          RU
        </button>
      </div>

      <div class="game-selector">
        <button
          v-for="game in games"
          :key="game.id"
          @click="selectGame(game.id)"
          :class="{ active: selectedGame === game.id }"
        >
          {{ game.name }}
        </button>
      </div>

      <RandomizeButton
        :loading="isLoading"
        :selected-game="selectedGame"
        @randomize="randomize"
      />

      <RandomResult
        :selected-game="selectedGame"
        :selected-class="selectedClass"
        :selected-gift="selectedGift"
        :is-spinning="isSpinning"
        :sound-enabled="soundEnabled"
        @update:sound-enabled="soundEnabled = $event"
      />
    </div>
    <footer class="footer">
      <a href="https://github.com/d-malashin/ds-start-randomizer" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import RandomizeButton from './components/RandomizeButton.vue'
import RandomResult from './components/RandomResult.vue'
import { gameData } from './data/gameData'
import ds1Bg from './assets/images/ds1-bg.jpg'
import ds2Bg from './assets/images/ds2-bg.jpg'
import ds3Bg from './assets/images/ds3-bg.jpg'

const { t, locale } = useI18n()

// Загружаем язык из localStorage или используем 'en' по умолчанию
const savedLanguage = localStorage.getItem('appLanguage') || 'en'
const currentLanguage = ref(savedLanguage)
locale.value = savedLanguage

const selectedGame = ref(null)
const selectedClass = ref(null)
const selectedGift = ref(null)
const isLoading = ref(false)
const result = ref(null)
const isSpinning = ref(false)
const soundEnabled = ref(localStorage.getItem('soundEnabled') === 'true' || localStorage.getItem('soundEnabled') === null)

const games = [
  { id: 'ds1', name: 'Dark Souls' },
  { id: 'ds2', name: 'Dark Souls II' },
  { id: 'ds3', name: 'Dark Souls III' }
]

const backgroundColor = computed(() => {
  switch (selectedGame.value) {
    case 'ds1':
      return 'linear-gradient(135deg, rgba(44, 62, 80, 0.8) 0%, rgba(74, 101, 114, 0.8) 100%)'
    case 'ds2':
      return 'linear-gradient(135deg, rgba(52, 73, 94, 0.8) 0%, rgba(93, 109, 126, 0.8) 100%)'
    case 'ds3':
      return 'linear-gradient(135deg, rgba(44, 62, 80, 0.8) 0%, rgba(86, 101, 115, 0.8) 100%)'
    default:
      return 'linear-gradient(135deg, rgba(44, 62, 80, 0.8) 0%, rgba(74, 101, 114, 0.8) 100%)'
  }
})

const backgroundImage = computed(() => {
  switch (selectedGame.value) {
    case 'ds1':
      return `url(${ds1Bg})`
    case 'ds2':
      return `url(${ds2Bg})`
    case 'ds3':
      return `url(${ds3Bg})`
    default:
      return `url(${ds1Bg})`
  }
})

onMounted(() => {
  // Устанавливаем начальный язык
  locale.value = currentLanguage.value
})

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'ru' : 'en'
  locale.value = currentLanguage.value
  // Сохраняем выбранный язык в localStorage
  localStorage.setItem('appLanguage', currentLanguage.value)
}

const selectGame = (gameId) => {
  selectedGame.value = gameId
  selectedClass.value = null
  selectedGift.value = null
}

async function getRandomNumber(min, max) {
  try {
    // Проверяем, что min и max являются числами
    if (isNaN(min) || isNaN(max)) {
      throw new Error('Invalid min or max value')
    }

    // Проверяем, что max не превышает допустимое значение
    const safeMax = Math.min(max, 1000000000)
    const safeMin = Math.max(min, -1000000000)

    const response = await fetch(
      `https://www.random.org/integers/?num=1&min=${safeMin}&max=${safeMax}&col=1&base=10&format=plain&rnd=new`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch random number')
    }

    const number = await response.text()
    return parseInt(number.trim())
  } catch (error) {
    console.error('Error fetching random number:', error)
    // Возвращаем случайное число в заданном диапазоне
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

const randomize = async () => {
  if (isLoading.value) return

  isLoading.value = true
  result.value = null
  selectedClass.value = null
  selectedGift.value = null

  try {
    // Получаем случайные числа от random.org
    const classIndex = await getRandomNumber(0, Object.keys(gameData[selectedGame.value].classes).length - 1)
    const giftIndex = await getRandomNumber(0, Object.keys(gameData[selectedGame.value].gifts).length - 1)

    // Устанавливаем выбранные значения
    selectedClass.value = Object.values(gameData[selectedGame.value].classes)[classIndex]
    selectedGift.value = Object.values(gameData[selectedGame.value].gifts)[giftIndex]

    // Запускаем анимацию прокрутки
    isSpinning.value = true

    // Ждем завершения анимации
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Устанавливаем результат
    result.value = {
      class: selectedClass.value,
      gift: selectedGift.value
    }
  } catch (error) {
    console.error('Error during randomization:', error)
    // Fallback на Math.random в случае ошибки
    const classes = Object.values(gameData[selectedGame.value].classes)
    const gifts = Object.values(gameData[selectedGame.value].gifts)
    const classIndex = Math.floor(Math.random() * classes.length)
    const giftIndex = Math.floor(Math.random() * gifts.length)
    selectedClass.value = classes[classIndex]
    selectedGift.value = gifts[giftIndex]

    // Запускаем анимацию прокрутки
    isSpinning.value = true

    // Ждем завершения анимации
    await new Promise(resolve => setTimeout(resolve, 1000))

    result.value = {
      class: selectedClass.value,
      gift: selectedGift.value
    }
  } finally {
    // Останавливаем анимацию
    isSpinning.value = false

    // Добавляем небольшую задержку перед сбросом состояния загрузки
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

// Сохраняем состояние звуковых эффектов
watch(soundEnabled, (newValue) => {
  localStorage.setItem('soundEnabled', newValue)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:root {
  --primary-color: #4a6572;
  --secondary-color: #34495e;
  --text-color: #ecf0f1;
  --background-color: rgba(44, 62, 80, 0.9);
  --border-color: #5d6d7e;
  --hover-color: #566573;
  --placeholder-color: #95a5a6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  min-height: 100vh;
  background-color: #2c3e50;
}

.app {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
  transition: background-image 0.5s ease-in-out;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  filter: blur(5px);
  z-index: -1;
  transition: background-image 0.5s ease-in-out;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 90%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  padding: 1rem 2rem;
  border-radius: 12px;
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  min-width: fit-content;
}

.language-selector {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  background: var(--background-color);
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
}

.language-selector button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.language-selector button.active {
  background: var(--primary-color);
}

.game-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.6rem;
}

.game-selector button {
  padding: 0.8rem 1.5rem;
  border: 2px solid var(--border-color);
  background: var(--background-color);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-selector button:hover {
  background: var(--hover-color);
}

.game-selector button.active {
  background: var(--primary-color);
  border-color: var(--text-color);
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .container {
    width: 95%;
  }

  .title {
    font-size: 1.8rem;
    padding: 0.75rem 1.5rem;
  }

  .language-selector {
    position: static;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .game-selector {
    flex-direction: column;
    align-items: center;
  }

  .game-selector button {
    width: 100%;
    max-width: 300px;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
}

.footer a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: #3498db;
}
</style>