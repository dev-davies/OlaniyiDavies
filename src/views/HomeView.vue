<script setup lang="ts">
import { Camera } from 'lucide-vue-next';
</script>

<template>
  <div class="container py-5">
    <div class="row min-h-screen align-items-center">
      <div class="col-12 text-center">
        <h1 class="display-1 fw-bold mb-3">John Doe</h1>
        <p class="lead mb-4">Full Stack Developer | Creative Coder</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-primary btn-lg">
             <Camera class="me-2" /> View Work
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
