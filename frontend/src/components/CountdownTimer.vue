<template>
  <div class="card">
    <div class="card-body text-center">
      <h6 class="card-subtitle mb-2 text-muted">Trading Round Timer</h6>
      <div class="timer-circle mx-auto" :class="timerClass">
        <svg width="120" height="120" class="timer-svg">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e0e0e0"
            stroke-width="8"
          />
          <circle
            ref="progressCircle"
            cx="60"
            cy="60"
            r="50"
            fill="none"
            :stroke="timerColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            transform="rotate(-90 60 60)"
            class="transition-all"
          />
        </svg>
        <div class="timer-content">
          <div class="h3 mb-0">{{ formattedTime }}</div>
          <small class="text-muted">Round {{ marketStore.currentRound }}</small>
        </div>
      </div>
      <div class="mt-3">
        <span class="badge" :class="marketStore.marketStatus === 'open' ? 'bg-success' : 'bg-danger'">
          {{ marketStore.marketStatus === 'open' ? 'Market Open' : 'Market Closed' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMarketStore } from '../store/market'

const marketStore = useMarketStore()
const progressCircle = ref(null)

const circumference = 2 * Math.PI * 50
const totalTime = 300

const formattedTime = computed(() => {
  const minutes = Math.floor(marketStore.roundTimeLeft / 60)
  const seconds = marketStore.roundTimeLeft % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const progressOffset = computed(() => {
  const progress = marketStore.roundTimeLeft / totalTime
  return circumference * (1 - progress)
})

const timerColor = computed(() => {
  const progress = marketStore.roundTimeLeft / totalTime
  if (progress > 0.5) return '#28a745'
  if (progress > 0.2) return '#ffc107'
  return '#dc3545'
})

const timerClass = computed(() => {
  const progress = marketStore.roundTimeLeft / totalTime
  if (progress < 0.2) return 'timer-warning'
  return ''
})

watch(() => marketStore.roundTimeLeft, (newTime) => {
  if (newTime <= 0) {
    if (progressCircle.value) {
      progressCircle.value.style.animation = 'pulse 0.5s ease-in-out'
    }
  }
})
</script>

<style scoped>
.timer-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.timer-svg {
  transform: rotate(-90deg);
}

.timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.transition-all {
  transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
}

.timer-warning {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>

