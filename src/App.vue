
<script setup>
import { useTarefas } from './composables/useTarefas';
import { useContador } from './composables/useContador';
import { useTema } from './composables/useTema';
import FormularioAdicionarTarefa from './components/FormularioAdicionarTarefa.vue';
import ListaTarefas from './components/ListaTarefas.vue';

const tarefasApi = useTarefas();
const { contador } = useContador();
const { tema, alternarTema } = useTema();

</script>

<template>
  <div class="min-h-screen flex items-center justify-center font-sans bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
        <div class="flex justify-between items-center mb-8">
             <h1 class="text-5xl font-bold text-gray-800 dark:text-white">App de Tarefas</h1>
             <button @click="alternarTema" class="p-2 rounded-full text-2xl">{{ tema === 'claro' ? '🌕' : '🌑' }}</button>
        </div>

      <p class="text-center text-gray-500 dark:text-gray-400 mb-4">Tempo decorrido: {{ contador }} segundos</p>

      <FormularioAdicionarTarefa @adicionar-tarefa="tarefasApi.adicionarTarefa" />

      <div class="flex justify-center my-4">
        <button @click="tarefasApi.filtro.value = 'todas'" class="px-4 py-2 mx-1 rounded-lg dark:text-white" :class="{ 'bg-blue-500 text-white': tarefasApi.filtro.value === 'todas', 'bg-gray-200 dark:bg-gray-700': tarefasApi.filtro.value !== 'todas' }">Todas</button>
        <button @click="tarefasApi.filtro.value = 'ativas'" class="px-4 py-2 mx-1 rounded-lg dark:text-white" :class="{ 'bg-blue-500 text-white': tarefasApi.filtro.value === 'ativas', 'bg-gray-200 dark:bg-gray-700': tarefasApi.filtro.value !== 'ativas' }">Ativas</button>
        <button @click="tarefasApi.filtro.value = 'concluidas'" class="px-4 py-2 mx-1 rounded-lg dark:text-white" :class="{ 'bg-blue-500 text-white': tarefasApi.filtro.value === 'concluidas', 'bg-gray-200 dark:bg-gray-700': tarefasApi.filtro.value !== 'concluidas' }">Concluídas</button>
      </div>

      <ListaTarefas />
    </div>
  </div>
</template>

<style scoped>
/* Nenhum estilo com escopo necessário, pois estamos usando o Tailwind CSS */
</style>
