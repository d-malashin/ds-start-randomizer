<template>
  <div class="random-result" v-if="selectedGame" :class="{ 'ds2': selectedGame === 'ds2' }">
    <div class="result-container">
      <div class="result-item">
        <h3>{{ t('class') }}</h3>
        <div class="items-list">
          <div v-for="(item, index) in classes" :key="item.en" class="item" :class="{
            'highlighted': highlightIndex === index
          }">
            {{ getItemName(item) }}
          </div>
        </div>
      </div>

      <div class="result-item">
        <h3>{{ t('gift') }}</h3>
        <div class="items-list">
          <div v-for="(item, index) in gifts" :key="item.en" class="item" :class="{
            'highlighted': highlightGiftIndex === index
          }">
            {{ getItemName(item) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameData } from '../data/gameData'

const props = defineProps({
  selectedGame: {
    type: String,
    default: null
  },
  selectedClass: {
    type: Object,
    default: null
  },
  selectedGift: {
    type: Object,
    default: null
  },
  isSpinning: {
    type: Boolean,
    default: false
  }
})

const { t, locale } = useI18n()
const currentLanguage = ref(locale.value)
const highlightIndex = ref(-1)
const highlightGiftIndex = ref(-1)
const spinInterval = ref(null)

const classes = computed(() => {
  if (!props.selectedGame) return []
  return Object.values(gameData[props.selectedGame].classes)
})

const gifts = computed(() => {
  if (!props.selectedGame) return []
  return Object.values(gameData[props.selectedGame].gifts)
})

const getItemName = (item) => {
  if (!item) return ''
  return currentLanguage.value === 'en' ? item.en : item.ru
}

watch(() => props.isSpinning, (newValue) => {
  if (newValue && props.selectedGame) {
    // Очищаем предыдущий интервал, если он существует
    if (spinInterval.value) {
      clearInterval(spinInterval.value)
    }

    const gameClasses = Object.values(gameData[props.selectedGame].classes)
    const gameGifts = Object.values(gameData[props.selectedGame].gifts)

    // Находим индексы выбранных значений
    const targetClassIndex = gameClasses.findIndex(c => c.en === props.selectedClass?.en)
    const targetGiftIndex = gameGifts.findIndex(g => g.en === props.selectedGift?.en)

    let currentStep = 0
    const totalSteps = 40 // Общее количество шагов анимации

    // Запускаем анимацию
    spinInterval.value = setInterval(() => {
      if (currentStep < totalSteps) {
        // Случайно выбираем индексы для анимации
        highlightIndex.value = Math.floor(Math.random() * gameClasses.length)
        highlightGiftIndex.value = Math.floor(Math.random() * gameGifts.length)
        currentStep++
      } else {
        // Останавливаемся на выбранных значениях
        highlightIndex.value = targetClassIndex
        highlightGiftIndex.value = targetGiftIndex
        clearInterval(spinInterval.value)
      }
    }, 50) // Уменьшаем интервал для более быстрой анимации
  } else {
    // Если анимация остановлена, очищаем интервал
    if (spinInterval.value) {
      clearInterval(spinInterval.value)
    }
  }
})

// Функция для прокрутки к выбранным элементам
const scrollToHighlightedItems = () => {
  // Находим все элементы списка
  const classItems = document.querySelectorAll('.result-item:first-child .item')
  const giftItems = document.querySelectorAll('.result-item:last-child .item')

  // Прокручиваем к выбранному классу
  if (highlightIndex.value >= 0 && classItems[highlightIndex.value]) {
    classItems[highlightIndex.value].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  // Прокручиваем к выбранному подарку
  if (highlightGiftIndex.value >= 0 && giftItems[highlightGiftIndex.value]) {
    giftItems[highlightGiftIndex.value].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

watch(() => locale.value, (newValue) => {
  currentLanguage.value = newValue
})

watch(() => props.selectedGame, (newValue) => {
  if (newValue) {
    highlightIndex.value = -1
    highlightGiftIndex.value = -1
  }
})
</script>

<style scoped>
.random-result {
  margin-top: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  height: calc(100vh - 400px);
  overflow: hidden;
  max-height: 675px;
}

.random-result.ds2 {
  max-height: 555px;
}

.result-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: 100%;
  overflow: hidden;
}

.result-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.result-item h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  flex-shrink: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0 0 2px;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) rgba(0, 0, 0, 0.5);
  padding-right: 4px;
  min-height: 0;
  flex: 1;
}

.items-list::-webkit-scrollbar {
  width: 4px;
}

.items-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
}

.items-list::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 2px;
}

.items-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.5);
}

.item {
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  font-size: 0.95rem;
  transform-origin: center;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item.highlighted {
  background: rgba(255, 215, 0, 0.15);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 1;
  border-radius: 0;
}

@media (max-width: 768px) {
  .result-container {
    grid-template-columns: 1fr;
  }
}
</style>