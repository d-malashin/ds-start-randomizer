<template>
  <div class="app" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="container">
      <h1>{{ t('title') }}</h1>
      <h1 class="subtitle">{{ t('subtitle') }}</h1>

      <div class="language-selector">
        <select v-model="currentLocale" @change="changeLocale">
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
      </div>

      <h2>{{ t('selectGame') }}</h2>
      <select v-model="selectedGame" @change="resetSelection">
        <option value="ds1">{{ t('games.ds1') }}</option>
        <option value="ds2">{{ t('games.ds2') }}</option>
        <option value="ds3">{{ t('games.ds3') }}</option>
      </select>

      <button class="randomize-btn" @click="randomize">{{ t('randomize') }}</button>

      <div class="result" v-if="selectedClass || selectedGift">
        <div class="class-info" v-if="selectedClass">
          <h3>{{ t('selectedClass') }}</h3>
          <div class="selection-box">
            <p>{{ selectedClass }}</p>
          </div>
        </div>
        <div class="gift-info" v-if="selectedGift">
          <h3>{{ t('selectedGift') }}</h3>
          <div class="selection-box">
            <p>{{ selectedGift }}</p>
          </div>
        </div>
      </div>
      <div class="result" v-else>
        <p class="placeholder">{{ t('clickRandomize') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameData } from './data/gameData'

const { t, locale } = useI18n()

const currentLocale = ref(locale.value)
const selectedGame = ref('ds1')
const selectedClass = ref('')
const selectedGift = ref('')

const backgroundImage = computed(() => {
  const images = {
    ds1: '/images/ds1-bg.jpg',
    ds2: '/images/ds2-bg.jpg',
    ds3: '/images/ds3-bg.jpg'
  }
  return images[selectedGame.value]
})

const changeLocale = () => {
  locale.value = currentLocale.value
}

const resetSelection = () => {
  selectedClass.value = ''
  selectedGift.value = ''
}

const randomize = () => {
  const game = gameData[selectedGame.value]
  const classes = Object.keys(game.classes)
  const gifts = Object.keys(game.gifts)

  selectedClass.value = classes[Math.floor(Math.random() * classes.length)]
  selectedGift.value = gifts[Math.floor(Math.random() * gifts.length)]
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
  --primary-color: #555555;
  --secondary-color: #333333;
  --text-color: #dddddd;
  --background-color: #222222;
  --border-color: #444444;
  --hover-color: #666666;
  --placeholder-color: #aaaaaa;
  --selection-bg: rgba(0, 0, 0, 0.6);
  --selection-border: #777777;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  font-weight: 300;
}

.app {
  min-height: 100vh;
  padding: 2rem;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  display: flex;
  justify-content: center;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgba(51, 51, 51, 0.85);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
}

h1 {
  text-align: center;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
}

h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 400;
}

select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: rgba(51, 51, 51, 0.9);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
}

select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.randomize-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  margin: 2rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.randomize-btn:hover {
  background-color: var(--hover-color);
}

.result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  min-height: 200px;
}

.class-info, .gift-info {
  margin-bottom: 1.5rem;
}

.selection-box {
  background-color: var(--selection-bg);
  border: 1px solid var(--selection-border);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.selection-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.placeholder {
  font-style: italic;
  color: var(--placeholder-color);
}

.language-selector {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  background-color: rgba(51, 51, 51, 0.8);
  padding: 0.5rem;
  border-radius: 4px;
}

.language-selector select {
  width: auto;
  margin-bottom: 0;
  border: none;
  background-color: transparent;
}

@media (max-width: 767px) {
  .app {
    padding: 1rem;
  }

  .container {
    padding: 1rem;
    width: 95%;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .language-selector {
    position: static;
    margin-bottom: 1rem;
    background-color: transparent;
    padding: 0;
  }

  .language-selector select {
    width: 100%;
  }
}
</style>