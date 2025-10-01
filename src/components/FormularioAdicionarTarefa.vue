
<script setup>
import { ref } from 'vue';

const novoTituloTarefa = ref('');
const emit = defineEmits(['adicionar-tarefa']);

function adicionarTarefa() {
  if (novoTituloTarefa.value.trim()) {
    emit('adicionar-tarefa', novoTituloTarefa.value);
    novoTituloTarefa.value = '';
  }
}
</script>

<template>
  <form @submit.prevent="adicionarTarefa" class="mb-4">
    <input
      v-model="novoTituloTarefa"
      placeholder="Adicionar uma nova tarefa..."
      class="w-full px-4 py-2 text-lg border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
    />
    <button type="submit" class="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md dark:hover:bg-blue-700">Adicionar Tarefa</button>
  </form>
</template>

<style scoped>
/* Nenhum estilo com escopo necessário, pois estamos usando o Tailwind CSS */
</style>
