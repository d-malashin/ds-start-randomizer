<template>
  <div class="random-result" v-if="gameVersion">
    <div class="result-container">
      <div class="result-section">
        <h3>{{ t('class') }}</h3>
        <div class="result-content" :class="{ 'spinning': isSpinning }">
          <div class="result-item" v-for="(cls, index) in gameData[gameVersion].classes"
               :key="cls.id"
               :class="{ 'selected': selectedClass && selectedClass.id === cls.id }">
            <h4>{{ cls.name[locale] }}</h4>
            <p>{{ cls.description[locale] }}</p>
          </div>
        </div>
      </div>
      <div class="result-section">
        <h3>{{ t('gift') }}</h3>
        <div class="result-content" :class="{ 'spinning': isSpinning }">
          <div class="result-item" v-for="(gift, index) in gameData[gameVersion].gifts"
               :key="gift.id"
               :class="{ 'selected': selectedGift && selectedGift.id === gift.id }">
            <h4>{{ gift.name[locale] }}</h4>
            <p>{{ gift.description[locale] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameData } from '../data/gameData'

const props = defineProps({
  gameVersion: String,
  selectedClass: Object,
  selectedGift: Object,
  isSpinning: Boolean
})

const { t, locale } = useI18n()
</script>

<style scoped>
.random-result {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-section {
  text-align: center;
}

.result-section h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.result-item {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.result-item.selected {
  background: var(--primary-color);
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--primary-color);
}

.result-item h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.result-item p {
  color: var(--text-color);
  font-size: 0.9rem;
  opacity: 0.8;
}

.spinning .result-item {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

@media (min-width: 768px) {
  .result-container {
    flex-direction: row;
  }

  .result-section {
    flex: 1;
  }
}
</style>