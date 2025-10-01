
<script setup>
import { inject } from 'vue';
import ItemTarefa from './ItemTarefa.vue';

const { tarefasFiltradas, removerTarefa, tarefas } = inject('tarefas');
const tema = inject('tema');

function alternarTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.concluida = !tarefa.concluida;
  }
}
</script>

<template>
  <ul>
    <ItemTarefa
      v-for="tarefa in tarefasFiltradas"
      :key="tarefa.id"
      :tarefa="tarefa"
      @remover-tarefa="removerTarefa(tarefa.id)"
      @alternar-tarefa="alternarTarefa(tarefa.id)"
    />
  </ul>
</template>

<style scoped>
/* Nenhum estilo com escopo necessário, pois estamos usando o Tailwind CSS */
</style>
