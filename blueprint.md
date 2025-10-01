
# Blueprint do App de Tarefas

## Visão Geral

Este documento descreve a estrutura, funcionalidades e design de uma aplicação de tarefas (Todo) moderna, construída com Vue.js e a Composition API. O objetivo é criar uma aplicação rica em funcionalidades, bem estruturada e visualmente atraente, que sirva como um exemplo completo das práticas modernas de desenvolvimento com Vue.

## Funcionalidades

- **Adicionar, Editar e Excluir Tarefas**: Funcionalidade principal para gerenciar uma lista de tarefas.
- **Filtrar Tarefas**: Os usuários могут filtrar as tarefas por status de conclusão (todas, ativas, concluídas).
- **Gerenciamento de Estado**: Toda a lógica relacionada às tarefas é encapsulada em um composable `useTarefas`.
- **Arquitetura Baseada em Componentes**: A aplicação é dividida em componentes menores e reutilizáveis.
- **Props e Eventos**: Os componentes se comunicam usando `defineProps` e `defineEmits`.
- **Injeção de Dependência**: `provide` e `inject` são usados para compartilhar dados através da árvore de componentes.
- **Hooks de Ciclo de Vida**: Demonstra o uso de `onMounted` e outros hooks do ciclo de vida.
- **Estado Reativo**: Utiliza `ref`, `reactive`, `computed` e `watch` para um gerenciamento de estado eficiente.
- **Persistência de Dados**: As tarefas e o tema selecionado são salvos no `localStorage` do navegador para persistir entre as sessões.
- **Seleção de Tema**: Permite que o usuário alterne entre um tema claro e um escuro.

## Estrutura do Projeto

```
/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- FormularioAdicionarTarefa.vue
|   |   |-- ItemTarefa.vue
|   |   |-- ListaTarefas.vue
|   |-- composables/
|   |   |-- useContador.js
|   |   |-- useTarefas.js
|   |   |-- useTema.js
|   |-- App.vue
|   |-- main.js
|   |-- style.css
|-- .gitignore
|-- blueprint.md
|-- index.html
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
```

## Design System

- **Framework**: Tailwind CSS (com suporte a modo escuro)
- **Tipografia**:
  - **Fonte**: Inter, sans-serif
  - **Títulos**: Negrito, com tamanho de fonte maior para ênfase.
  - **Corpo**: Peso regular, otimizado para legibilidade.
- **Paleta de Cores**:
  - **Primária**: Um azul vibrante para elementos interativos.
  - **Secundária**: Cinza claro para fundos (modo claro), cinza escuro para fundos (modo escuro).
  - **Texto**: Cinza escuro (modo claro), cinza claro (modo escuro).
- **Layout**:
  - Layout de coluna única e centralizado para simplicidade.
  - Amplo espaço em branco para reduzir a desordem.
  - Uma estética limpa e moderna.
- **Iconografia**:
  - Uso de emojis para uma experiência de usuário amigável e intuitiva.
