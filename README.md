# Vue 3 Composition API: Guia Completo do Zero ao Avançado

## Introdução

O Vue 3 trouxe uma revolução com a **Composition API**, uma nova forma de organizar e reutilizar lógica em componentes. Diferente da Options API (o estilo tradicional do Vue 2), a Composition API oferece maior flexibilidade, melhor tipagem com TypeScript e composição de lógica através de funções reutilizáveis chamadas **composables**.

Neste artigo, vamos construir um site completo explorando todos os conceitos fundamentais da Composition API, desde a estrutura básica até padrões avançados de reatividade.

---

## 1. Estrutura Básica com `<script setup>`

A tag `<script setup>` é um açúcar sintático que simplifica drasticamente o uso da Composition API. Tudo declarado dentro dela fica automaticamente disponível no template.

```vue
<template>
  <div class="container">
    <h1>{{ titulo }}</h1>
    <p>{{ mensagem }}</p>
  </div>
</template>

<script setup>
const titulo = 'Meu Primeiro Componente Vue 3';
const mensagem = 'Bem-vindo à Composition API!';
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>
```

**Vantagens do `<script setup>`:**
- Menos boilerplate (não precisa de `return` explícito)
- Melhor performance (código mais otimizado em tempo de compilação)
- Tipagem automática com TypeScript
- Acesso direto a variáveis no template

---

## 2. `ref()` — Estados Reativos Primitivos

O `ref()` cria uma **referência reativa** para valores primitivos (strings, números, booleanos). Para acessar ou modificar o valor no JavaScript, use `.value`. No template, o `.value` é automaticamente desempacotado.

```vue
<template>
  <div class="counter">
    <h2>Contador: {{ contador }}</h2>
    <button @click="incrementar">+1</button>
    <button @click="decrementar">-1</button>
    <button @click="resetar">Reset</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const contador = ref(0);

const incrementar = () => {
  contador.value++;
};

const decrementar = () => {
  contador.value--;
};

const resetar = () => {
  contador.value = 0;
};
</script>
```

**Por que `.value`?**
O Vue envolve o valor primitivo em um objeto para poder rastreá-lo. Isso permite que o sistema de reatividade detecte mudanças.

---

## 3. `reactive()` — Objetos e Arrays Reativos

Para objetos e arrays, use `reactive()`. Ele cria um **proxy reativo** sem necessidade de `.value`.

```vue
<template>
  <div class="form-usuario">
    <h2>Cadastro de Usuário</h2>
    <input v-model="usuario.nome" placeholder="Nome" />
    <input v-model="usuario.email" placeholder="Email" />
    <input v-model="usuario.idade" type="number" placeholder="Idade" />
    
    <h3>Dados:</h3>
    <pre>{{ usuario }}</pre>
    
    <button @click="adicionarHobby">Adicionar Hobby</button>
    <ul>
      <li v-for="(hobby, index) in usuario.hobbies" :key="index">
        {{ hobby }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const usuario = reactive({
  nome: '',
  email: '',
  idade: 0,
  hobbies: []
});

const adicionarHobby = () => {
  const hobby = prompt('Digite um hobby:');
  if (hobby) {
    usuario.hobbies.push(hobby);
  }
};
</script>
```

**`ref()` vs `reactive()`:**
- `ref()`: Para primitivos e quando você precisa substituir o valor inteiro
- `reactive()`: Para objetos complexos que serão modificados internamente

---

## 4. `computed` — Propriedades Derivadas

Propriedades computadas são **valores derivados** que são recalculados automaticamente quando suas dependências mudam. São **lazy** (só computam quando necessário) e **cacheadas**.

```vue
<template>
  <div class="carrinho">
    <h2>Carrinho de Compras</h2>
    
    <div v-for="item in itens" :key="item.id" class="item">
      <span>{{ item.nome }} - R$ {{ item.preco }}</span>
      <input v-model.number="item.quantidade" type="number" min="0" />
    </div>
    
    <div class="total">
      <h3>Subtotal: R$ {{ subtotal.toFixed(2) }}</h3>
      <h3>Desconto (10%): R$ {{ desconto.toFixed(2) }}</h3>
      <h2>Total: R$ {{ total.toFixed(2) }}</h2>
      <p>Quantidade de itens: {{ totalItens }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';

const itens = reactive([
  { id: 1, nome: 'Notebook', preco: 3000, quantidade: 1 },
  { id: 2, nome: 'Mouse', preco: 50, quantidade: 2 },
  { id: 3, nome: 'Teclado', preco: 200, quantidade: 1 }
]);

const subtotal = computed(() => {
  return itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
});

const desconto = computed(() => subtotal.value * 0.1);

const total = computed(() => subtotal.value - desconto.value);

const totalItens = computed(() => {
  return itens.reduce((acc, item) => acc + item.quantidade, 0);
});
</script>
```

**Vantagens do `computed`:**
- Cache automático (não recalcula se dependências não mudarem)
- Código mais limpo que calcular no template
- Performance otimizada

---

## 5. `watch` e `watchEffect` — Observação de Mudanças

### `watch` — Observador Explícito

Permite observar valores específicos e executar efeitos colaterais quando eles mudam.

```vue
<template>
  <div class="busca">
    <h2>Buscar Usuário</h2>
    <input v-model="termoBusca" placeholder="Digite para buscar..." />
    <p v-if="carregando">Carregando...</p>
    <div v-else-if="resultado">
      <h3>Resultado:</h3>
      <pre>{{ resultado }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const termoBusca = ref('');
const resultado = ref(null);
const carregando = ref(false);

// Watch com debounce manual
let timeoutId = null;

watch(termoBusca, (novoValor, valorAnterior) => {
  console.log(`Busca mudou de "${valorAnterior}" para "${novoValor}"`);
  
  carregando.value = true;
  resultado.value = null;
  
  // Limpa timeout anterior
  clearTimeout(timeoutId);
  
  // Simula chamada de API com delay
  timeoutId = setTimeout(() => {
    resultado.value = {
      termo: novoValor,
      encontrados: Math.floor(Math.random() * 100),
      timestamp: new Date().toLocaleTimeString()
    };
    carregando.value = false;
  }, 500);
});
</script>
```

### `watchEffect` — Observador Automático

Executa imediatamente e re-executa automaticamente quando qualquer dependência reativa muda.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const nome = ref('João');
const sobrenome = ref('Silva');

// Executa imediatamente e toda vez que nome ou sobrenome mudar
watchEffect(() => {
  console.log(`Nome completo: ${nome.value} ${sobrenome.value}`);
  // Poderia salvar no localStorage, enviar analytics, etc.
  localStorage.setItem('nomeCompleto', `${nome.value} ${sobrenome.value}`);
});
</script>
```

**Diferenças:**
- `watch`: Mais controle, acesso ao valor anterior, lazy por padrão
- `watchEffect`: Mais simples, executa imediatamente, rastreia dependências automaticamente

---

## 6. Hooks de Ciclo de Vida

Os hooks de ciclo de vida permitem executar código em momentos específicos da vida do componente.

```vue
<template>
  <div class="lifecycle-demo">
    <h2>Demonstração do Ciclo de Vida</h2>
    <p>Contador: {{ contador }}</p>
    <button @click="contador++">Incrementar</button>
    <p>Verifique o console para ver os logs do ciclo de vida</p>
  </div>
</template>

<script setup>
import { 
  ref, 
  onBeforeMount, 
  onMounted, 
  onBeforeUpdate, 
  onUpdated, 
  onBeforeUnmount, 
  onUnmounted 
} from 'vue';

const contador = ref(0);

// Antes do componente ser montado no DOM
onBeforeMount(() => {
  console.log('🔵 onBeforeMount: Componente vai ser montado');
});

// Após o componente ser montado no DOM
onMounted(() => {
  console.log('✅ onMounted: Componente montado! DOM está disponível');
  // Aqui você pode fazer chamadas de API, configurar listeners, etc.
  
  // Exemplo: buscar dados
  fetch('https://api.exemplo.com/dados')
    .then(res => res.json())
    .then(data => console.log('Dados carregados:', data))
    .catch(err => console.error('Erro:', err));
});

// Antes do componente ser atualizado
onBeforeUpdate(() => {
  console.log('🟡 onBeforeUpdate: Componente vai ser atualizado');
});

// Após o componente ser atualizado
onUpdated(() => {
  console.log('🟢 onUpdated: Componente atualizado! Contador =', contador.value);
});

// Antes do componente ser desmontado
onBeforeUnmount(() => {
  console.log('🟠 onBeforeUnmount: Componente vai ser removido');
  // Limpar listeners, intervals, etc.
});

// Após o componente ser desmontado
onUnmounted(() => {
  console.log('🔴 onUnmounted: Componente removido do DOM');
});
</script>
```

**Principais Hooks:**
- `onBeforeMount`: Preparação antes da renderização
- `onMounted`: Inicialização, chamadas de API, setup de bibliotecas
- `onBeforeUpdate`: Preparação antes de atualizações
- `onUpdated`: Reações a mudanças no DOM
- `onBeforeUnmount`: Limpeza de recursos
- `onUnmounted`: Finalização, remoção de listeners

---

## 7. `defineProps` — Recebendo Props

Props são a forma de passar dados do componente pai para o filho. No `<script setup>`, use `defineProps`.

**ComponenteFilho.vue:**
```vue
<template>
  <div class="card-produto">
    <h3>{{ titulo }}</h3>
    <p>{{ descricao }}</p>
    <p class="preco">R$ {{ preco.toFixed(2) }}</p>
    <span class="badge" :class="disponivel ? 'disponivel' : 'indisponivel'">
      {{ disponivel ? 'Disponível' : 'Esgotado' }}
    </span>
  </div>
</template>

<script setup>
// Definição básica
// const props = defineProps(['titulo', 'descricao', 'preco', 'disponivel']);

// Definição com validação e tipos
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    default: 'Sem descrição'
  },
  preco: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  },
  disponivel: {
    type: Boolean,
    default: true
  }
});

// Você pode usar props.titulo, props.preco, etc.
// No template, pode acessar diretamente sem 'props.'
</script>

<style scoped>
.card-produto {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
}

.preco {
  font-size: 24px;
  font-weight: bold;
  color: #27ae60;
}

.badge {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.disponivel {
  background: #27ae60;
  color: white;
}

.indisponivel {
  background: #e74c3c;
  color: white;
}
</style>
```

**ComponentePai.vue:**
```vue
<template>
  <div class="lista-produtos">
    <h2>Nossos Produtos</h2>
    <ComponenteFilho
      v-for="produto in produtos"
      :key="produto.id"
      :titulo="produto.nome"
      :descricao="produto.descricao"
      :preco="produto.preco"
      :disponivel="produto.disponivel"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ComponenteFilho from './ComponenteFilho.vue';

const produtos = reactive([
  { id: 1, nome: 'Notebook', descricao: 'Core i7, 16GB RAM', preco: 3500, disponivel: true },
  { id: 2, nome: 'Mouse Gamer', descricao: 'RGB, 12000 DPI', preco: 150, disponivel: true },
  { id: 3, nome: 'Teclado Mecânico', descricao: 'Switch Blue', preco: 450, disponivel: false }
]);
</script>
```

---

## 8. `defineEmits` — Emitindo Eventos

Emits permitem que componentes filhos comuniquem eventos ao componente pai.

**BotaoContador.vue:**
```vue
<template>
  <div class="botao-contador">
    <button @click="decrementar" :disabled="contador <= 0">-</button>
    <span class="contador">{{ contador }}</span>
    <button @click="incrementar" :disabled="contador >= max">+</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  valorInicial: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 10
  }
});

// Define os eventos que este componente pode emitir
const emit = defineEmits(['atualizar', 'limiteAtingido']);

const contador = ref(props.valorInicial);

const incrementar = () => {
  if (contador.value < props.max) {
    contador.value++;
    emit('atualizar', contador.value);
    
    if (contador.value === props.max) {
      emit('limiteAtingido', 'máximo');
    }
  }
};

const decrementar = () => {
  if (contador.value > 0) {
    contador.value--;
    emit('atualizar', contador.value);
    
    if (contador.value === 0) {
      emit('limiteAtingido', 'mínimo');
    }
  }
};
</script>

<style scoped>
.botao-contador {
  display: flex;
  gap: 10px;
  align-items: center;
}

button {
  padding: 8px 16px;
  font-size: 18px;
  cursor: pointer;
}

.contador {
  font-size: 24px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}
</style>
```

**Pai.vue:**
```vue
<template>
  <div class="app">
    <h2>Controle de Contadores</h2>
    
    <BotaoContador
      :valor-inicial="5"
      :max="10"
      @atualizar="handleAtualizar"
      @limite-atingido="handleLimite"
    />
    
    <p>Último valor: {{ ultimoValor }}</p>
    <p v-if="mensagem" class="alerta">{{ mensagem }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BotaoContador from './BotaoContador.vue';

const ultimoValor = ref(5);
const mensagem = ref('');

const handleAtualizar = (novoValor) => {
  ultimoValor.value = novoValor;
  console.log('Contador atualizado para:', novoValor);
};

const handleLimite = (tipo) => {
  mensagem.value = `Limite ${tipo} atingido!`;
  setTimeout(() => {
    mensagem.value = '';
  }, 3000);
};
</script>
```

---

## 9. Composables — Funções Reutilizáveis

Composables são **funções que encapsulam lógica reativa reutilizável**. É o equivalente aos custom hooks do React.

**composables/useContador.js:**
```javascript
import { ref, computed } from 'vue';

export function useContador(valorInicial = 0, max = 100) {
  const contador = ref(valorInicial);
  const historico = ref([valorInicial]);
  
  const dobro = computed(() => contador.value * 2);
  const ehPar = computed(() => contador.value % 2 === 0);
  const porcentagem = computed(() => (contador.value / max) * 100);
  
  const incrementar = (quantidade = 1) => {
    const novoValor = Math.min(contador.value + quantidade, max);
    contador.value = novoValor;
    historico.value.push(novoValor);
  };
  
  const decrementar = (quantidade = 1) => {
    const novoValor = Math.max(contador.value - quantidade, 0);
    contador.value = novoValor;
    historico.value.push(novoValor);
  };
  
  const resetar = () => {
    contador.value = valorInicial;
    historico.value = [valorInicial];
  };
  
  const desfazer = () => {
    if (historico.value.length > 1) {
      historico.value.pop();
      contador.value = historico.value[historico.value.length - 1];
    }
  };
  
  return {
    // Estado
    contador,
    historico,
    // Computados
    dobro,
    ehPar,
    porcentagem,
    // Métodos
    incrementar,
    decrementar,
    resetar,
    desfazer
  };
}
```

**composables/useFetch.js:**
```javascript
import { ref, watchEffect } from 'vue';

export function useFetch(url) {
  const dados = ref(null);
  const erro = ref(null);
  const carregando = ref(false);
  
  const buscar = async () => {
    dados.value = null;
    erro.value = null;
    carregando.value = true;
    
    try {
      const response = await fetch(url.value || url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      dados.value = await response.json();
    } catch (e) {
      erro.value = e.message;
    } finally {
      carregando.value = false;
    }
  };
  
  // Se url for reativo, re-busca automaticamente
  if (typeof url === 'object' && 'value' in url) {
    watchEffect(buscar);
  } else {
    buscar();
  }
  
  return { dados, erro, carregando, buscar };
}
```

**Usando os Composables:**
```vue
<template>
  <div class="demo-composables">
    <h2>Demonstração de Composables</h2>
    
    <!-- useContador -->
    <div class="secao">
      <h3>Contador Reutilizável</h3>
      <p>Valor: {{ contador }}</p>
      <p>Dobro: {{ dobro }}</p>
      <p>É par: {{ ehPar ? 'Sim' : 'Não' }}</p>
      <p>Progresso: {{ porcentagem.toFixed(1) }}%</p>
      
      <button @click="incrementar()">+1</button>
      <button @click="incrementar(5)">+5</button>
      <button @click="decrementar()">-1</button>
      <button @click="resetar()">Reset</button>
      <button @click="desfazer()" :disabled="historico.length <= 1">Desfazer</button>
    </div>
    
    <!-- useFetch -->
    <div class="secao">
      <h3>Fetch Reutilizável</h3>
      <p v-if="carregando">Carregando dados...</p>
      <p v-else-if="erro" class="erro">Erro: {{ erro }}</p>
      <pre v-else-if="dados">{{ JSON.stringify(dados, null, 2) }}</pre>
      <button @click="buscar()">Recarregar</button>
    </div>
  </div>
</template>

<script setup>
import { useContador } from './composables/useContador';
import { useFetch } from './composables/useFetch';

// Usando o composable de contador
const { 
  contador, 
  historico, 
  dobro, 
  ehPar, 
  porcentagem,
  incrementar, 
  decrementar, 
  resetar, 
  desfazer 
} = useContador(0, 50);

// Usando o composable de fetch
const { dados, erro, carregando, buscar } = useFetch(
  'https://jsonplaceholder.typicode.com/todos/1'
);
</script>
```

---

## 10. Estrutura Completa de um Componente

Agora vamos criar um componente completo que utiliza todos os conceitos aprendidos.

**TodoApp.vue:**
```vue
<template>
  <div class="todo-app">
    <h1>📝 Minha Lista de Tarefas</h1>
    
    <!-- Formulário de adição -->
    <form @submit.prevent="adicionarTarefa" class="form-adicionar">
      <input
        v-model="novaTarefa.titulo"
        placeholder="Digite uma tarefa..."
        required
      />
      <select v-model="novaTarefa.prioridade">
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>
      <button type="submit">Adicionar</button>
    </form>
    
    <!-- Filtros -->
    <div class="filtros">
      <button
        v-for="filtro in filtros"
        :key="filtro"
        :class="{ ativo: filtroAtivo === filtro }"
        @click="filtroAtivo = filtro"
      >
        {{ filtro }}
      </button>
    </div>
    
    <!-- Estatísticas -->
    <div class="estatisticas">
      <p>Total: {{ tarefas.length }}</p>
      <p>Concluídas: {{ tarefasConcluidas }}</p>
      <p>Pendentes: {{ tarefasPendentes }}</p>
      <p>Progresso: {{ progresso }}%</p>
    </div>
    
    <!-- Lista de tarefas -->
    <TransitionGroup name="lista" tag="ul" class="lista-tarefas">
      <li
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :class="['tarefa-item', `prioridade-${tarefa.prioridade}`, { concluida: tarefa.concluida }]"
      >
        <input
          type="checkbox"
          v-model="tarefa.concluida"
          @change="salvarNoStorage"
        />
        <span class="tarefa-titulo">{{ tarefa.titulo }}</span>
        <span class="tarefa-data">{{ formatarData(tarefa.criadoEm) }}</span>
        <button @click="removerTarefa(tarefa.id)" class="btn-remover">
          🗑️
        </button>
      </li>
    </TransitionGroup>
    
    <p v-if="tarefasFiltradas.length === 0" class="lista-vazia">
      Nenhuma tarefa encontrada
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';

// ===== ESTADO =====
const tarefas = ref([]);
const novaTarefa = reactive({
  titulo: '',
  prioridade: 'media'
});
const filtroAtivo = ref('Todas');
const filtros = ['Todas', 'Pendentes', 'Concluídas'];

// ===== COMPUTED =====
const tarefasFiltradas = computed(() => {
  switch (filtroAtivo.value) {
    case 'Pendentes':
      return tarefas.value.filter(t => !t.concluida);
    case 'Concluídas':
      return tarefas.value.filter(t => t.concluida);
    default:
      return tarefas.value;
  }
});

const tarefasConcluidas = computed(() => 
  tarefas.value.filter(t => t.concluida).length
);

const tarefasPendentes = computed(() => 
  tarefas.value.filter(t => !t.concluida).length
);

const progresso = computed(() => {
  if (tarefas.value.length === 0) return 0;
  return Math.round((tarefasConcluidas.value / tarefas.value.length) * 100);
});

// ===== MÉTODOS =====
const adicionarTarefa = () => {
  if (!novaTarefa.titulo.trim()) return;
  
  tarefas.value.push({
    id: Date.now(),
    titulo: novaTarefa.titulo,
    prioridade: novaTarefa.prioridade,
    concluida: false,
    criadoEm: new Date()
  });
  
  // Reseta o formulário
  novaTarefa.titulo = '';
  novaTarefa.prioridade = 'media';
  
  salvarNoStorage();
};

const removerTarefa = (id) => {
  tarefas.value = tarefas.value.filter(t => t.id !== id);
  salvarNoStorage();
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const salvarNoStorage = () => {
  localStorage.setItem('tarefas-vue', JSON.stringify(tarefas.value));
};

const carregarDoStorage = () => {
  const salvo = localStorage.getItem('tarefas-vue');
  if (salvo) {
    tarefas.value = JSON.parse(salvo);
  }
};

// ===== WATCHERS =====
watch(progresso, (novoProgresso) => {
  if (novoProgresso === 100 && tarefas.value.length > 0) {
    console.log('🎉 Parabéns! Todas as tarefas foram concluídas!');
  }
});

// ===== LIFECYCLE =====
onMounted(() => {
  console.log('✅ Componente montado!');
  carregarDoStorage();
});
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.form-adicionar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.form-adicionar input {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-adicionar select,
.form-adicionar button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.form-adicionar button {
  background: #42b983;
  color: white;
  font-weight: bold;
}

.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filtros button {
  flex: 1;
  padding: 8px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filtros button.ativo {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.estatisticas {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.estatisticas p {
  margin: 0;
  font-weight: bold;
}

.lista-tarefas {
  list-style: none;
  padding: 0;
}

.tarefa-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  margin-bottom: 10px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.tarefa-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.tarefa-item.concluida {
  opacity: 0.6;
  background: #f8f9fa;
}

.tarefa-item.concluida .tarefa-titulo {
  text-decoration: line-through;
  color: #999;
}

.prioridade-alta {
  border-left-color: #e74c3c;
}

.prioridade-media {
  border-left-color: #f39c12;
}

.prioridade-baixa {
  border-left-color: #3498db;
}

.tarefa-titulo {
  flex: 1;
  font-size: 16px;
}

.tarefa-data {
  font-size: 12px;
  color: #999;
}

.btn-remover {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.btn-remover:hover {
  opacity: 1;
}

.lista-vazia {
  text-align: center;
  color: #999;
  padding: 40px;
  font-style: italic;
}

/* Animações de transição */
.lista-move,
.lista-enter-active,
.lista-leave-active {
  transition: all 0.5s ease;
}

.lista-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.lista-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.lista-leave-active {
  position: absolute;
}
</style>
```

---

## Como a Reatividade do Vue 3 Funciona

### Sistema de Reatividade Baseado em Proxies

O Vue 3 usa **JavaScript Proxies** para rastrear mudanças em objetos reativos. Diferente do Vue 2 (que usava `Object.defineProperty`), os Proxies permitem:

1. **Detecção de propriedades adicionadas/removidas dinamicamente**
2. **Suporte nativo para Arrays** sem hacks
3. **Melhor performance** com menos overhead

```javascript
import { reactive, effect } from 'vue';

const estado = reactive({
  contador: 0,
  usuario: {
    nome: 'João'
  }
});

// effect rastreia dependências automaticamente
effect(() => {
  console.log(`Contador: ${estado.contador}`);
});

estado.contador++; // Console: "Contador: 1"
estado.contador++; // Console: "Contador: 2"

// Adicionar propriedade dinamicamente funciona!
estado.novaPropriedade = 'valor'; // ✅ Reativo no Vue 3
```

### Anatomia do Sistema de Reatividade

```javascript
// Simplificação de como funciona internamente
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      // Rastreia a dependência
      track(target, key);
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value);
      // Dispara atualizações
      trigger(target, key);
      return result;
    }
  });
}
```

---

## Vue 3 vs React: Diferenças na Reatividade

### Vue 3: Reatividade Automática

```javascript
// Vue 3 - Reatividade automática via Proxies
import { ref, computed } from 'vue';

const contador = ref(0);
const dobro = computed(() => contador.value * 2);

contador.value++; // ✅ Atualização automática
console.log(dobro.value); // 2
```

**Características:**
- ✅ Rastreamento automático de dependências
- ✅ Não precisa declarar dependências manualmente
- ✅ Atualizações granulares (só o necessário re-renderiza)
- ✅ Menos boilerplate

### React: Reatividade Manual com Hooks

```javascript
// React - Reatividade manual via setState
import { useState, useMemo } from 'react';

const [contador, setContador] = useState(0);
const dobro = useMemo(() => contador * 2, [contador]); // ⚠️ Precisa declarar [contador]

setContador(prev => prev + 1); // Precisa usar setState
console.log(dobro); // 2
```

**Características:**
- ⚠️ Precisa declarar dependências explicitamente
- ⚠️ Usa `setState` para todas as atualizações
- ⚠️ Re-renderiza o componente inteiro por padrão
- ⚠️ Mais verboso (arrays de dependências)

---

## Vue 3 e Signals: A Conexão

### O que são Signals?

Signals são um **padrão de reatividade fine-grained** popularizado por frameworks como Solid.js e recentemente adotado por outros frameworks.

**Comparação:**

```javascript
// Solid.js Signals
import { createSignal, createEffect } from 'solid-js';

const [contador, setContador] = createSignal(0);
createEffect(() => {
  console.log(contador()); // Função getter
});

setContador(1); // Função setter

// Vue 3 ref (similar a Signals)
import { ref, watchEffect } from 'vue';

const contador = ref(0);
watchEffect(() => {
  console.log(contador.value); // .value é o getter
});

contador.value = 1; // .value = setter
```

### Vue 3 já usa o conceito de Signals!

O `ref()` do Vue 3 é essencialmente um **Signal**:
- ✅ Acesso granular ao valor via `.value`
- ✅ Rastreamento automático de dependências
- ✅ Atualizações precisas (não re-renderiza tudo)

```javascript
// Vue 3 - Reatividade granular (tipo Signal)
import { ref, watchEffect } from 'vue';

const nome = ref('João');
const idade = ref(25);

watchEffect(() => {
  console.log(`Nome: ${nome.value}`); // Só rastreia 'nome'
});

idade.value = 26; // ✅ NÃO dispara o watchEffect acima (granular!)
nome.value = 'Maria'; // ✅ Dispara o watchEffect (dependência rastreada)
```

### Por que Vue 3 não chama de "Signals"?

Vue 3 foi lançado **antes** do termo "Signals" se popularizar. Mas o conceito é o mesmo:
- `ref()` = Signal primitivo
- `reactive()` = Signal para objetos
- `computed()` = Derived Signal
- `watchEffect()` = Effect (reação a Signals)

---

## Exemplo Prático: Sistema de Reatividade em Ação

Vamos criar um exemplo que demonstra a **reatividade granular** do Vue 3:

**SistemaReativo.vue:**
```vue
<template>
  <div class="sistema-reativo">
    <h2>🔬 Demonstração de Reatividade Granular</h2>
    
    <div class="painel">
      <h3>Estado Primitivo (ref)</h3>
      <p>Contador A: {{ contadorA }}</p>
      <button @click="contadorA++">Incrementar A</button>
      <p class="info">Renderizações deste bloco: {{ renderizacoesA }}</p>
    </div>
    
    <div class="painel">
      <h3>Estado Separado (ref)</h3>
      <p>Contador B: {{ contadorB }}</p>
      <button @click="contadorB++">Incrementar B</button>
      <p class="info">Renderizações deste bloco: {{ renderizacoesB }}</p>
    </div>
    
    <div class="painel">
      <h3>Computado Derivado</h3>
      <p>Soma (A + B): {{ soma }}</p>
      <p>Produto (A × B): {{ produto }}</p>
      <p class="info">Este bloco só re-renderiza quando A ou B mudam</p>
    </div>
    
    <div class="painel">
      <h3>Estado de Objeto (reactive)</h3>
      <p>Nome: {{ usuario.nome }}</p>
      <input v-model="usuario.nome" />
      <p>Email: {{ usuario.email }}</p>
      <input v-model="usuario.email" />
      <p class="info">Mudanças são rastreadas por propriedade</p>
    </div>
    
    <div class="logs">
      <h3>📋 Logs de Efeitos Colaterais</h3>
      <ul>
        <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect, onUpdated } from 'vue';

// Estados primitivos separados
const contadorA = ref(0);
const contadorB = ref(0);
const renderizacoesA = ref(0);
const renderizacoesB = ref(0);

// Estado de objeto
const usuario = reactive({
  nome: 'João Silva',
  email: 'joao@example.com'
});

// Logs para demonstrar reatividade
const logs = ref([]);

const adicionarLog = (mensagem) => {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${mensagem}`);
  if (logs.value.length > 10) logs.value.pop();
};

// Computados - só recalculam quando dependências mudam
const soma = computed(() => {
  adicionarLog('🔄 Recalculando soma');
  return contadorA.value + contadorB.value;
});

const produto = computed(() => {
  adicionarLog('🔄 Recalculando produto');
  return contadorA.value * contadorB.value;
});

// Watch específico - só observa contadorA
watch(contadorA, (novo, antigo) => {
  renderizacoesA.value++;
  adicionarLog(`👁️ Watch: contadorA mudou de ${antigo} para ${novo}`);
});

// Watch específico - só observa contadorB
watch(contadorB, (novo, antigo) => {
  renderizacoesB.value++;
  adicionarLog(`👁️ Watch: contadorB mudou de ${antigo} para ${novo}`);
});

// WatchEffect - rastreia automaticamente nome do usuário
watchEffect(() => {
  adicionarLog(`👤 Nome do usuário: ${usuario.nome}`);
});

// WatchEffect - rastreia automaticamente email do usuário
watchEffect(() => {
  adicionarLog(`📧 Email do usuário: ${usuario.email}`);
});

// Lifecycle
onUpdated(() => {
  adicionarLog('🔃 Componente atualizado');
});
</script>

<style scoped>
.sistema-reativo {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.painel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid #42b983;
}

.painel h3 {
  margin-top: 0;
  color: #2c3e50;
}

.painel input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.painel button {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.painel button:hover {
  background: #35a372;
}

.info {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-top: 10px;
}

.logs {
  background: #2c3e50;
  color: #ecf0f1;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.logs h3 {
  margin-top: 0;
  color: #42b983;
}

.logs ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.logs li {
  padding: 5px 0;
  border-bottom: 1px solid #34495e;
}

.logs li:last-child {
  border-bottom: none;
}
</style>
```

---

## Comparação Detalhada: Vue 3 vs React

### 1. Declaração de Estado

**Vue 3:**
```javascript
// Primitivos
const contador = ref(0);
const nome = ref('João');

// Objetos
const usuario = reactive({
  nome: 'João',
  idade: 25
});
```

**React:**
```javascript
// Primitivos
const [contador, setContador] = useState(0);
const [nome, setNome] = useState('João');

// Objetos
const [usuario, setUsuario] = useState({
  nome: 'João',
  idade: 25
});
```

### 2. Atualização de Estado

**Vue 3:**
```javascript
// Direto - reativo automaticamente
contador.value++;
nome.value = 'Maria';
usuario.idade = 26;
```

**React:**
```javascript
// Precisa usar setState
setContador(prev => prev + 1);
setNome('Maria');
setUsuario(prev => ({ ...prev, idade: 26 }));
```

### 3. Valores Computados

**Vue 3:**
```javascript
const dobro = computed(() => contador.value * 2);
// Sem array de dependências!
```

**React:**
```javascript
const dobro = useMemo(() => contador * 2, [contador]);
// ⚠️ Precisa declarar [contador]
```

### 4. Efeitos Colaterais

**Vue 3:**
```javascript
watchEffect(() => {
  console.log(contador.value);
  // Rastreia dependências automaticamente
});
```

**React:**
```javascript
useEffect(() => {
  console.log(contador);
}, [contador]); // ⚠️ Precisa declarar [contador]
```

### 5. Performance

**Vue 3:**
- ✅ Atualizações granulares (só re-renderiza o necessário)
- ✅ Não re-renderiza componente inteiro
- ✅ Sistema de templates otimizado

**React:**
- ⚠️ Re-renderiza componente inteiro por padrão
- ⚠️ Precisa de `React.memo`, `useMemo`, `useCallback` para otimizar
- ⚠️ Pode causar re-renderizações desnecessárias

---

## Criando um Site Completo: Exemplo Final

Vamos criar um **Dashboard Completo** que integra todos os conceitos:

**Dashboard.vue:**
```vue
<template>
  <div class="dashboard">
    <header class="header">
      <h1>📊 Dashboard Vue 3</h1>
      <p>Olá, {{ usuarioAtual.nome }}!</p>
    </header>
    
    <div class="grid">
      <!-- Card de Estatísticas -->
      <Card titulo="Estatísticas" icone="📈">
        <div class="stats">
          <StatItem label="Vendas Hoje" :valor="vendas.hoje" prefixo="R$" />
          <StatItem label="Novos Clientes" :valor="clientes.novos" />
          <StatItem label="Taxa de Conversão" :valor="taxaConversao" sufixo="%" />
        </div>
      </Card>
      
      <!-- Card de Tarefas -->
      <Card titulo="Tarefas Pendentes" icone="✓">
        <ListaTarefas
          :tarefas="tarefasPendentes"
          @concluir="concluirTarefa"
          @remover="removerTarefa"
        />
      </Card>
      
      <!-- Card de Atividades -->
      <Card titulo="Atividades Recentes" icone="🕐">
        <AtividadesList :atividades="atividadesRecentes" />
      </Card>
      
      <!-- Card de Gráfico -->
      <Card titulo="Vendas do Mês" icone="📊" class="card-large">
        <GraficoVendas :dados="dadosGrafico" />
      </Card>
    </div>
    
    <!-- Notificações -->
    <TransitionGroup name="notificacao" tag="div" class="notificacoes">
      <Notificacao
        v-for="notif in notificacoes"
        :key="notif.id"
        :tipo="notif.tipo"
        :mensagem="notif.mensagem"
        @fechar="removerNotificacao(notif.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import Card from './components/Card.vue';
import StatItem from './components/StatItem.vue';
import ListaTarefas from './components/ListaTarefas.vue';
import AtividadesList from './components/AtividadesList.vue';
import GraficoVendas from './components/GraficoVendas.vue';
import Notificacao from './components/Notificacao.vue';
import { useDashboard } from './composables/useDashboard';
import { useNotificacoes } from './composables/useNotificacoes';

// ===== COMPOSABLES =====
const {
  vendas,
  clientes,
  tarefas,
  atividades,
  carregarDados,
  atualizarDados
} = useDashboard();

const { notificacoes, adicionarNotificacao, removerNotificacao } = useNotificacoes();

// ===== ESTADO LOCAL =====
const usuarioAtual = reactive({
  nome: 'João Silva',
  cargo: 'Administrador'
});

// ===== COMPUTED =====
const tarefasPendentes = computed(() => 
  tarefas.value.filter(t => !t.concluida)
);

const atividadesRecentes = computed(() => 
  atividades.value.slice(0, 5)
);

const taxaConversao = computed(() => {
  if (clientes.total === 0) return 0;
  return ((clientes.novos / clientes.total) * 100).toFixed(1);
});

const dadosGrafico = computed(() => ({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  valores: [12000, 19000, 15000, 25000, 22000, 30000]
}));

// ===== MÉTODOS =====
const concluirTarefa = (id) => {
  const tarefa = tarefas.value.find(t => t.id === id);
  if (tarefa) {
    tarefa.concluida = true;
    adicionarNotificacao('sucesso', `Tarefa "${tarefa.titulo}" concluída!`);
  }
};

const removerTarefa = (id) => {
  const index = tarefas.value.findIndex(t => t.id === id);
  if (index !== -1) {
    tarefas.value.splice(index, 1);
    adicionarNotificacao('info', 'Tarefa removida');
  }
};

// ===== WATCHERS =====
watch(
  () => vendas.hoje,
  (novoValor, valorAnterior) => {
    if (novoValor > valorAnterior) {
      adicionarNotificacao('sucesso', `Nova venda registrada! Total: R$ ${novoValor}`);
    }
  }
);

// ===== LIFECYCLE =====
let intervalo = null;

onMounted(async () => {
  console.log('📱 Dashboard montado');
  await carregarDados();
  
  // Atualiza dados a cada 30 segundos
  intervalo = setInterval(() => {
    atualizarDados();
  }, 30000);
  
  adicionarNotificacao('info', 'Dashboard carregado com sucesso!');
});

onUnmounted(() => {
  console.log('👋 Dashboard desmontado');
  if (intervalo) clearInterval(intervalo);
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 36px;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-large {
  grid-column: span 2;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notificacoes {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Animações */
.notificacao-enter-active,
.notificacao-leave-active {
  transition: all 0.3s ease;
}

.notificacao-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notificacao-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .card-large {
    grid-column: span 1;
  }
}
</style>
```

**composables/useDashboard.js:**
```javascript
import { ref, reactive } from 'vue';

export function useDashboard() {
  const vendas = reactive({
    hoje: 0,
    mes: 0,
    total: 0
  });
  
  const clientes = reactive({
    novos: 0,
    ativos: 0,
    total: 0
  });
  
  const tarefas = ref([]);
  const atividades = ref([]);
  const carregando = ref(false);
  
  const carregarDados = async () => {
    carregando.value = true;
    
    // Simula chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    vendas.hoje = 5430;
    vendas.mes = 127890;
    vendas.total = 1543200;
    
    clientes.novos = 23;
    clientes.ativos = 456;
    clientes.total = 1234;
    
    tarefas.value = [
      { id: 1, titulo: 'Revisar relatório', concluida: false },
      { id: 2, titulo: 'Contatar fornecedor', concluida: false },
      { id: 3, titulo: 'Aprovar orçamento', concluida: false }
    ];
    
    atividades.value = [
      { id: 1, tipo: 'venda', descricao: 'Nova venda realizada', tempo: '5 min atrás' },
      { id: 2, tipo: 'cliente', descricao: 'Cliente cadastrado', tempo: '12 min atrás' },
      { id: 3, tipo: 'pagamento', descricao: 'Pagamento recebido', tempo: '1 hora atrás' }
    ];
    
    carregando.value = false;
  };
  
  const atualizarDados = () => {
    // Simula atualização em tempo real
    vendas.hoje += Math.floor(Math.random() * 500);
    clientes.novos += Math.floor(Math.random() * 3);
  };
  
  return {
    vendas,
    clientes,
    tarefas,
    atividades,
    carregando,
    carregarDados,
    atualizarDados
  };
}
```

---

## Conclusão

O Vue 3 com Composition API oferece uma abordagem moderna e poderosa para construir aplicações web. Seus principais diferenciais são:

✅ **Reatividade automática e granular** baseada em Proxies  
✅ **Composables** para reutilização de lógica  
✅ **Performance superior** com atualizações precisas  
✅ **Menos boilerplate** comparado ao React  
✅ **Sistema similar a Signals** antes mesmo do termo se popularizar  
✅ **TypeScript de primeira classe**  
✅ **Organização clara** com `<script setup>`

Com os conceitos apresentados neste artigo, você está pronto para criar aplicações Vue 3 completas, desde componentes simples até sistemas complexos com estado compartilhado, efeitos colaterais e composição de lógica reutilizável.