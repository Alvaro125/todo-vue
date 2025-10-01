
import { ref, watch, provide, readonly } from 'vue';

export function useTema() {
  const tema = ref(localStorage.getItem('tema') || 'claro');

  function alternarTema() {
    tema.value = tema.value === 'claro' ? 'escuro' : 'claro';
  }

  watch(tema, (novoTema) => {
    localStorage.setItem('tema', novoTema);
    if (novoTema === 'escuro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  // Aplica o tema inicial
  if (tema.value === 'escuro') {
    document.documentElement.classList.add('dark');
  }

  // Fornece o tema para os componentes descendentes
  provide('tema', readonly(tema));

  return {
    tema,
    alternarTema,
  };
}
