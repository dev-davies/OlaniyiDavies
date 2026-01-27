import { ref, onMounted, onUnmounted } from 'vue';

export function useTextMorph(titles: string[], readTime = 3500, transitionTime = 1000) {
  const wordGroups = ref<{ chars: string[]; startIndex: number }[]>([]);
  const isFadingOut = ref(false);
  let currentIndex = 0;
  let timeoutId: number;

  const updateChars = (text: string) => {
    // Split by space to get words
    const words = text.split(' ');
    let charCounter = 0;
    
    wordGroups.value = words.map(word => {
      const chars = word.split('');
      const startIndex = charCounter;
      // Increment counter by word length + 1 (for the space)
      charCounter += chars.length + 1;
      
      return {
        chars,
        startIndex
      };
    });
  };

  const startLoop = () => {
    // Initialize with first title
    updateChars(titles[0] || '');

    const loop = () => {
      timeoutId = window.setTimeout(() => {
        // 1. Trigger Fade Out (Flow L -> R)
        isFadingOut.value = true;

        setTimeout(() => {
          // 2. Swap Text
          currentIndex = (currentIndex + 1) % titles.length;
          updateChars(titles[currentIndex] || '');
          
          // 3. Trigger Fade In (Flow L -> R)
          isFadingOut.value = false;

          loop(); // Recursion
        }, transitionTime);

      }, readTime);
    };
    loop();
  };

  onMounted(() => {
    startLoop();
  });

  onUnmounted(() => {
    clearTimeout(timeoutId);
  });

  return {
    wordGroups,
    isFadingOut
  };
}
