
import { ref, onUnmounted } from 'vue';

export function useContador() {
  const contador = ref(0);
  const intervalo = setInterval(() => {
    contador.value++;
  }, 1000);

  onUnmounted(() => {
    clearInterval(intervalo);
  });

  return {
    contador,
  };
}
