<template>
  <div class="leaderboard-page">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h1>Leaderboard</h1>
          <p class="text-muted">Top traders ranked by portfolio performance</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <Leaderboard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Leaderboard from '../components/Leaderboard.vue'
</script>

<style scoped>
.leaderboard-page {
  padding: 20px 0;
}
</style>

