<template>
  <div class="random-result" v-if="selectedGame" :class="{ 'ds2': selectedGame === 'ds2' }">
    <div class="sound-toggle">
      <label>
        <input
          type="checkbox"
          :checked="soundEnabled"
          @change="emit('update:soundEnabled', $event.target.checked)"
        >
        {{ t('sound_effects') }}
      </label>
    </div>
    <div class="result-container">
      <div class="result-item">
        <h3>{{ t('class') }}</h3>
        <div class="items-list">
          <div v-for="(item, index) in classes" :key="item.en" class="item" :class="{
            'highlighted': highlightIndex === index
          }">
            <span class="item-number">{{ index + 1 }}</span>
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
            <span class="item-number">{{ index + 1 }}</span>
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
import sound1 from '/sounds/sound1.mp3'
import sound2 from '/sounds/sound2.mp3'
import sound3 from '/sounds/sound3.mp3'
import sound4 from '/sounds/sound4.mp3'


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
  },
  soundEnabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:soundEnabled'])

const { t, locale } = useI18n()
const currentLanguage = ref(locale.value)
const highlightIndex = ref(-1)
const highlightGiftIndex = ref(-1)
const spinInterval = ref(null)
const currentAudio = ref(null)

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

const scrollToHighlightedItems = () => {
  // Находим все элементы списка
  const classItems = document.querySelectorAll('.result-item:first-child .items-list .item')
  const giftItems = document.querySelectorAll('.result-item:last-child .items-list .item')

  // Прокручиваем к выбранному классу
  if (highlightIndex.value >= 0 && classItems[highlightIndex.value]) {
    const classList = classItems[highlightIndex.value].closest('.items-list')
    if (classList) {
      classList.scrollTop = classItems[highlightIndex.value].offsetTop - (classList.clientHeight / 2) + (classItems[highlightIndex.value].clientHeight / 2)
    }
  }

  // Прокручиваем к выбранному подарку
  if (highlightGiftIndex.value >= 0 && giftItems[highlightGiftIndex.value]) {
    const giftList = giftItems[highlightGiftIndex.value].closest('.items-list')
    if (giftList) {
      giftList.scrollTop = giftItems[highlightGiftIndex.value].offsetTop - (giftList.clientHeight / 2) + (giftItems[highlightGiftIndex.value].clientHeight / 2)
    }
  }
}

// Функция для воспроизведения случайного звука
const playRandomSound = () => {
  if (!props.soundEnabled) return

  // Останавливаем предыдущий звук, если он есть
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
    currentAudio.value = null
  }

  const sounds = [sound1, sound2, sound3, sound4]
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
  const audio = new Audio(randomSound)
  currentAudio.value = audio

  // Добавляем обработку ошибок
  audio.onerror = () => {
    console.warn('Failed to play sound:', randomSound)
  }

  // Пробуем воспроизвести звук
  audio.play().catch(error => {
    console.warn('Error playing sound:', error)
  })
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
    const totalSteps = 20 // Общее количество шагов анимации

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
    }, 50)
  } else {
    // Если анимация остановлена
    if (spinInterval.value) {
      clearInterval(spinInterval.value)
    }

    // Если у нас есть выбранные значения, прокручиваем к ним
    if (props.selectedClass && props.selectedGift) {
      // Даем время на обновление DOM
      setTimeout(() => {
        scrollToHighlightedItems()
        playRandomSound()
      }, 100)
    }
  }
})

watch(() => locale.value, (newValue) => {
  currentLanguage.value = newValue
})

watch(() => props.selectedGame, (newValue) => {
  if (newValue) {
    highlightIndex.value = -1
    highlightGiftIndex.value = -1
  }
})

// Следим за изменением выбранных значений
watch([() => props.selectedClass, () => props.selectedGift], ([newClass, newGift]) => {
  if (newClass && newGift && !props.isSpinning) {
    setTimeout(scrollToHighlightedItems, 100)
  }
})

// Следим за изменением состояния звуковых эффектов
watch(() => props.soundEnabled, (newValue) => {
  if (!newValue && currentAudio.value) {
    // Если звуковые эффекты выключены и есть активный аудио элемент, останавливаем его
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
    currentAudio.value = null
  }
})
</script>

<style scoped>
.random-result {
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  height: calc(100vh - 300px);
  overflow: hidden;
  max-height: 580px;
  position: relative;
}

.random-result.ds2 {
  max-height: 555px;
}

.result-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
  overflow: hidden;
}

.result-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  height: calc(100% - 1rem); /* Вычитаем отступ между колонками */
  max-height: calc(100% - 2.5rem);
}

.result-item h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  flex-shrink: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  height: calc(100% - 1.6rem); /* Вычитаем высоту заголовка (1.1rem) + отступ (0.5rem) */
  max-height: calc(100% - 1.6rem);
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
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  font-size: 0.95rem;
  transform-origin: center;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.item-number {
  position: absolute;
  left: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
  color: rgba(255, 215, 0, 0.7);
}

.item.highlighted .item-number {
  opacity: 1;
  color: rgba(255, 215, 0, 1);
  left: 1rem;
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

.sound-toggle {
  margin-bottom: 1rem;
  text-align: right;
}

.sound-toggle label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: rgba(255, 215, 0, 0.7);
}

.sound-toggle input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}
</style>