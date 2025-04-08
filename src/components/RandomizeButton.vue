<template>
  <button
    class="randomize-button"
    @click="$emit('randomize')"
    :disabled="isLoading"
  >
    <span v-if="!isLoading">{{ t('randomize') }}</span>
    <span v-else class="loading">{{ t('loading') }}</span>
  </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['randomize'])
</script>

<style scoped>
.randomize-button {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
}

.randomize-button:hover:not(:disabled) {
  background: var(--hover-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.randomize-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .randomize-button {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
  }
}
</style>