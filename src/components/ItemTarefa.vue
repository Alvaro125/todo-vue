
<script setup>
defineProps({
  tarefa: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['remover-tarefa', 'alternar-tarefa']);

function removerTarefa() {
  emit('remover-tarefa');
}

function alternarTarefa() {
  emit('alternar-tarefa');
}
</script>

<template>
  <li class="flex items-center justify-between p-3 my-2 rounded-lg shadow-md transition-all duration-300" :class="{ 'bg-green-100 dark:bg-green-800': tarefa.concluida, 'bg-white dark:bg-gray-700': !tarefa.concluida }">
    <span
      @click="alternarTarefa"
      :class="{ 'line-through text-gray-400 dark:text-gray-500': tarefa.concluida, 'cursor-pointer': true }"
      class="flex-grow text-lg dark:text-white"
    >
      {{ tarefa.titulo }}
    </span>
    <button @click="removerTarefa" class="ml-4 text-red-500 hover:text-red-700 transition-colors duration-300 dark:hover:text-red-400">❌</button>
  </li>
</template>

<style scoped>
/* Nenhum estilo com escopo necessário, pois estamos usando o Tailwind CSS */
</style>
