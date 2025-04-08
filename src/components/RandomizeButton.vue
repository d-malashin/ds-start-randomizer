<template>
  <div class="randomize-button-container">
    <button
      class="randomize-button"
      :class="{ loading }"
      @click="$emit('randomize')"
      :disabled="loading || !selectedGame"
    >
      <span class="button-text">{{ buttonText }}</span>
      <div class="loading-spinner" v-if="loading"></div>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  selectedGame: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()

const buttonText = computed(() => {
  if (!props.selectedGame) return t('selectGame')
  return props.loading ? t('loading') : t('randomize')
})

defineEmits(['randomize'])
</script>

<style scoped>
.randomize-button-container {
  text-align: center;
  margin-top: 2rem;
}

.randomize-button {
  position: relative;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  background: var(--primary-color);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.randomize-button:hover:not(:disabled) {
  background: var(--hover-color);
  transform: translateY(-2px);
}

.randomize-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 3px solid var(--border-color);
  border-top-color: var(--text-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .randomize-button {
    width: 100%;
    min-width: unset;
  }
}
</style>