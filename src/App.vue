<template>
  <div class="app" :class="selectedGame">
    <div class="background-overlay"></div>
    <div class="container">
      <button class="language-selector" @click="toggleLanguage">
        {{ currentLanguage === 'en' ? 'RU' : 'EN' }}
      </button>

      <h1>{{ $t('title') }}</h1>

      <div class="game-selector">
        <select v-model="selectedGame">
          <option value="ds1">{{ $t('ds1') }}</option>
          <option value="ds2">{{ $t('ds2') }}</option>
          <option value="ds3">{{ $t('ds3') }}</option>
        </select>
      </div>

      <RandomizeButton
        :loading="isLoading"
        @randomize="randomize"
      />

      <LoadingSpinner v-if="isLoading" />

      <RandomResult
        v-if="(selectedClass || selectedGift) && !isLoading"
        :selected-class="selectedClass"
        :selected-gift="selectedGift"
        class="result-container"
      />
      <p v-else-if="!isLoading" class="no-selection">{{ $t('noSelection') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import RandomResult from './components/RandomResult.vue'
import RandomizeButton from './components/RandomizeButton.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { gameData } from './data/gameData'

const { t, locale } = useI18n()

const selectedGame = ref('ds1')
const selectedClass = ref(null)
const selectedGift = ref(null)
const isLoading = ref(false)
const currentLanguage = computed(() => locale.value)

const getRandomNumber = async (min, max) => {
  try {
    const response = await fetch(
      `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const number = await response.text()
    return parseInt(number.trim())
  } catch (error) {
    console.warn('Failed to get random number from random.org, using Math.random instead:', error)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'ru' : 'en'
}

const randomize = async () => {
  isLoading.value = true
  selectedClass.value = null
  selectedGift.value = null

  try {
    const gameVersion = gameData[selectedGame.value]
    const classes = Object.entries(gameVersion.classes)
    const gifts = Object.entries(gameVersion.gifts)

    const [classIndex, giftIndex] = await Promise.all([
      getRandomNumber(0, classes.length - 1),
      getRandomNumber(0, gifts.length - 1)
    ])

    const randomClass = classes[classIndex][1]
    const randomGift = gifts[giftIndex][1]

    // Добавляем небольшую задержку для лучшего UX
    await new Promise(resolve => setTimeout(resolve, 300))

    selectedClass.value = randomClass
    selectedGift.value = randomGift
  } catch (error) {
    console.error('Error during randomization:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --text-color: #ecf0f1;
  --background-color: #2c3e50;
  --border-color: #34495e;
  --hover-color: #3498db;
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
}

.app {
  min-height: 100vh;
  position: relative;
  transition: background-image 0.5s ease;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 0.5s ease;
  z-index: -1;
}

.app.ds1::before {
  background-image: url('/src/assets/images/ds1-bg.jpg');
}

.app.ds2::before {
  background-image: url('/src/assets/images/ds2-bg.jpg');
}

.app.ds3::before {
  background-image: url('/src/assets/images/ds3-bg.jpg');
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

.container {
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.language-selector {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  z-index: 2;
}

.language-selector:hover {
  background: var(--hover-color);
}

.game-selector {
  margin-bottom: 2rem;
  text-align: center;
}

select {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: var(--primary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  width: 200px;
}

select:focus {
  outline: none;
  border-color: var(--hover-color);
}

.no-selection {
  text-align: center;
  color: var(--placeholder-color);
  margin-top: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.result-container {
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s forwards;
  background: rgba(44, 62, 80, 0.8);
  padding: 2rem;
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .language-selector {
    position: static;
    margin: 0 auto 1rem;
    display: block;
  }

  h1 {
    font-size: 1.5rem;
  }

  select {
    width: 100%;
    max-width: 200px;
  }

  .result-container {
    padding: 1rem;
  }
}
</style>