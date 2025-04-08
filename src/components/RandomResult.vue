<template>
  <div class="random-result">
    <div v-if="selectedClass" class="result-item">
      <h3>{{ t('class') }}</h3>
      <div class="item-card">
        <h4>{{ selectedClass[currentLocale] }}</h4>
        <p>{{ selectedClass.description[currentLocale] }}</p>
      </div>
    </div>

    <div v-if="selectedGift" class="result-item">
      <h3>{{ t('gift') }}</h3>
      <div class="item-card">
        <h4>{{ selectedGift[currentLocale] }}</h4>
        <p>{{ selectedGift.description[currentLocale] }}</p>
      </div>
    </div>

    <div v-if="!selectedClass && !selectedGift" class="placeholder">
      <p>{{ t('noSelection') }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const currentLocale = locale

defineProps({
  selectedClass: {
    type: Object,
    default: null
  },
  selectedGift: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.random-result {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.result-item {
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

h3 {
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

.placeholder {
  text-align: center;
  padding: 2rem;
  color: var(--placeholder-color);
  font-style: italic;
}

@media (max-width: 768px) {
  .result-item {
    padding: 1rem;
  }

  .item-card {
    padding: 0.8rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  h4 {
    font-size: 1.1rem;
  }
}
</style>