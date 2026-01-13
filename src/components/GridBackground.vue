<script setup lang="ts">
</script>

<template>
  <div class="grid-bg"></div>
</template>

<style scoped>
.grid-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  /* Use the classes from main.scss but apply here for specificity/scoping if needed, 
     or just rely on the global class if applied to body. 
     Actually, better to use the specific class here. */
}

/* We can re-declare or just use the global .bg-dots if we apply it to this div */
</style>

<style>
/* Global integration */
.grid-bg {
    background-image: radial-gradient(var(--dots-color) 1px, transparent 1px);
    background-size: 24px 24px;
    background-color: var(--bg-color);
}
</style>
