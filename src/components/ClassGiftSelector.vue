<template>
  <div class="class-gift-selector">
    <h2>{{ t('selectGame') }}</h2>
    <select v-model="selectedGame" @change="resetSelection">
      <option value="ds1">{{ t('games.ds1') }}</option>
      <option value="ds2">{{ t('games.ds2') }}</option>
      <option value="ds3">{{ t('games.ds3') }}</option>
    </select>

    <div v-if="selectedClass" class="selected-item">
      <h3>{{ t('selectedClass') }}</h3>
      <div class="item-card">
        <h4>{{ selectedClass.name[currentLocale] }}</h4>
        <p>{{ selectedClass.description[currentLocale] }}</p>
      </div>
    </div>

    <div v-if="selectedGift" class="selected-item">
      <h3>{{ t('selectedGift') }}</h3>
      <div class="item-card">
        <h4>{{ selectedGift.name[currentLocale] }}</h4>
        <p>{{ selectedGift.description[currentLocale] }}</p>
      </div>
    </div>

    <button @click="randomize" class="randomize-button">
      {{ t('randomize') }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameData } from '../data/gameData'

const { t, locale } = useI18n()
const currentLocale = locale

const selectedGame = ref('ds1')
const selectedClass = ref(null)
const selectedGift = ref(null)

const resetSelection = () => {
  selectedClass.value = null
  selectedGift.value = null
}

const randomize = () => {
  const game = gameData[selectedGame.value]
  const classes = Object.keys(game.classes)
  const gifts = Object.keys(game.gifts)

  const randomClassIndex = Math.floor(Math.random() * classes.length)
  const randomGiftIndex = Math.floor(Math.random() * gifts.length)

  selectedClass.value = game.classes[classes[randomClassIndex]]
  selectedGift.value = game.gifts[gifts[randomGiftIndex]]
}

// Инициализируем начальные значения при монтировании компонента
onMounted(() => {
  randomize()
})
</script>

<style scoped>
.class-gift-selector {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.selected-item {
  background: var(--background-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-card {
  background: var(--secondary-color);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

h2, h3 {
  color: var(--text-color);
  font-size: 1.5rem;
  margin: 0;
}

h4 {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

p {
  color: var(--text-color);
  margin: 0;
  line-height: 1.5;
}

select {
  background: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.randomize-button {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.randomize-button:hover {
  background: var(--hover-color);
}

@media (max-width: 768px) {
  .class-gift-selector {
    padding: 1rem;
  }

  .selected-item {
    padding: 1rem;
  }

  .item-card {
    padding: 0.8rem;
  }

  h2, h3 {
    font-size: 1.3rem;
  }

  h4 {
    font-size: 1.1rem;
  }
}
</style>