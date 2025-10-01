
import { ref, reactive, computed, watch, onMounted } from 'vue';

export function useTarefas() {
  const tarefas = reactive(JSON.parse(localStorage.getItem('tarefas') || '[]'));
  const filtro = ref('todas'); // 'todas', 'ativas', 'concluidas'

  const tarefasFiltradas = computed(() => {
    switch (filtro.value) {
      case 'ativas':
        return tarefas.filter(tarefa => !tarefa.concluida);
      case 'concluidas':
        return tarefas.filter(tarefa => tarefa.concluida);
      default:
        return tarefas;
    }
  });

  function adicionarTarefa(titulo) {
    if (titulo.trim()) {
      tarefas.push({ id: Date.now(), titulo, concluida: false });
    }
  }

  function removerTarefa(id) {
    const indice = tarefas.findIndex(tarefa => tarefa.id === id);
    if (indice !== -1) {
      tarefas.splice(indice, 1);
    }
  }

  watch(tarefas, (novasTarefas) => {
    localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
  }, { deep: true });

  onMounted(() => {
    console.log('Composable useTarefas montado!');
    // Remove a inicialização com tarefas padrão
  });

  return {
    tarefas,
    filtro,
    tarefasFiltradas,
    adicionarTarefa,
    removerTarefa,
  };
}
