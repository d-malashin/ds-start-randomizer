<template>
  <div class="random-result" v-if="selectedGame">
    <div class="result-container">
      <div class="result-item">
        <h3>{{ t('class') }}</h3>
        <div class="items-list">
          <div
            v-for="(item, index) in classes"
            :key="item.en"
            class="item"
            :class="{
              'highlight': highlightIndex === index
            }"
          >
            {{ getItemName(item) }}
          </div>
        </div>
      </div>

      <div class="result-item">
        <h3>{{ t('gift') }}</h3>
        <div class="items-list">
          <div
            v-for="(item, index) in gifts"
            :key="item.en"
            class="item"
            :class="{
              'highlight': highlightGiftIndex === index
            }"
          >
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

    // Начинаем с первого элемента
    highlightIndex.value = 0
    highlightGiftIndex.value = 0

    let currentStep = 0
    const totalSpins = 3 // Количество полных оборотов
    const stepsPerSpin = Math.max(gameClasses.length, gameGifts.length) // Количество шагов на один оборот
    const totalSteps = totalSpins * stepsPerSpin + targetClassIndex // Общее количество шагов + индекс выбранного класса

    // Запускаем анимацию
    spinInterval.value = setInterval(() => {
      if (currentStep < totalSteps) {
        // Последовательно прокручиваем варианты
        highlightIndex.value = (highlightIndex.value + 1) % gameClasses.length
        highlightGiftIndex.value = (highlightGiftIndex.value + 1) % gameGifts.length
        currentStep++
      } else {
        // Останавливаемся на выбранных значениях
        clearInterval(spinInterval.value)
        highlightIndex.value = targetClassIndex
        highlightGiftIndex.value = targetGiftIndex
      }
    }, 100) // Скорость вращения
  } else {
    // Если анимация остановлена, устанавливаем индексы на выбранные значения
    if (spinInterval.value) {
      clearInterval(spinInterval.value)
    }

    if (props.selectedClass && props.selectedGift) {
      const gameClasses = Object.values(gameData[props.selectedGame].classes)
      const gameGifts = Object.values(gameData[props.selectedGame].gifts)

      highlightIndex.value = gameClasses.findIndex(c => c.en === props.selectedClass.en)
      highlightGiftIndex.value = gameGifts.findIndex(g => g.en === props.selectedGift.en)
    } else {
      highlightIndex.value = -1
      highlightGiftIndex.value = -1
    }
  }
})

watch(() => locale.value, (newValue) => {
  currentLanguage.value = newValue
})
</script>

<style scoped>
.random-result {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.result-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.result-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.result-item h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  max-height: calc(100vh - 500px);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) var(--background-color);
  padding-right: 8px;
  position: relative;
}

.items-list::-webkit-scrollbar {
  width: 8px;
}

.items-list::-webkit-scrollbar-track {
  background: var(--background-color);
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb:hover {
  background: var(--hover-color);
}

.item {
  padding: 0.8rem;
  background: var(--background-color);
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 500;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item.highlight {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--text-color);
  font-weight: 700;
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(74, 101, 114, 0.9);
  opacity: 1;
  z-index: 1;
  position: relative;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .result-container {
    grid-template-columns: 1fr;
  }

  .items-list {
    max-height: 300px;
  }
}
</style>