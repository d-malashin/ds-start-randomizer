<template>
  <div class="game-selector">
    <h2>{{ t('selectGame') }}</h2>
    <select v-model="selectedGame" @change="onGameChange">
      <option value="ds1">{{ t('games.ds1') }}</option>
      <option value="ds2">{{ t('games.ds2') }}</option>
      <option value="ds3">{{ t('games.ds3') }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const selectedGame = ref('ds1')

const emit = defineEmits(['game-changed'])

const onGameChange = () => {
  emit('game-changed', selectedGame.value)
}
</script>

<style scoped>
.game-selector {
  margin-bottom: 2rem;
}

h2 {
  color: var(--text-color);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

select {
  background: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.3rem;
  }
}
</style>