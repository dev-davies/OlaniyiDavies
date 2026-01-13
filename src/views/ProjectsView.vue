<script setup lang="ts">
</script>

<template>
  <div class="container py-5">
    <h1 class="mb-5">Projects</h1>
    <div class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="i in 6" :key="i">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Project {{ i }}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-outline-primary stretched-link">View Details</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
