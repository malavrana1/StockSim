<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Leaderboard</h5>
      <span class="badge bg-primary">Round {{ marketStore.currentRound }}</span>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Portfolio Value</th>
              <th>Gain/Loss</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(player, index) in leaderboard" 
              :key="player.id"
              :class="{ 'table-warning': player.id === currentUserId }"
            >
              <td>
                <span class="badge" :class="getRankBadgeClass(index + 1)">
                  {{ index + 1 }}
                </span>
              </td>
              <td>{{ player.name }}</td>
              <td>${{ player.portfolioValue.toFixed(2) }}</td>
              <td>
                <span :class="player.gainLoss >= 0 ? 'text-success' : 'text-danger'">
                  {{ player.gainLoss >= 0 ? '+' : '' }}{{ player.gainLoss.toFixed(2) }}
                  ({{ player.gainLossPercent >= 0 ? '+' : '' }}{{ player.gainLossPercent.toFixed(2) }}%)
                </span>
              </td>
              <td>
                <span 
                  v-for="badge in player.badges" 
                  :key="badge"
                  class="badge bg-secondary me-1"
                  :title="badge"
                >
                  {{ badge.charAt(0) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMarketStore } from '../store/market'
import { useUserStore } from '../store/user'

const marketStore = useMarketStore()
const userStore = useUserStore()

const leaderboard = ref([])
const currentUserId = computed(() => userStore.user?.id)

const getRankBadgeClass = (rank) => {
  if (rank === 1) return 'bg-warning text-dark'
  if (rank === 2) return 'bg-secondary'
  if (rank === 3) return 'bg-info'
  return 'bg-light text-dark'
}

onMounted(() => {
  leaderboard.value = [
    { id: 1, name: 'Trader1', portfolioValue: 125000, gainLoss: 25000, gainLossPercent: 25, badges: ['First Trade', 'Profit Maker'] },
    { id: 2, name: 'Trader2', portfolioValue: 115000, gainLoss: 15000, gainLossPercent: 15, badges: ['Risk Taker'] },
    { id: 3, name: 'Trader3', portfolioValue: 110000, gainLoss: 10000, gainLossPercent: 10, badges: [] },
  ]
})
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>

