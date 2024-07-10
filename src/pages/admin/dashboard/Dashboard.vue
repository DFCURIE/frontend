<!-- frontend/src/pages/admin/dashboard/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h1 class="page-title font-bold mb-8">Dashboard</h1>
    <section class="flex flex-col gap-8">
      <DashboardCards />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WorkflowChart />
        <UserGrowthChart />
      </div>
      <va-card>
        <va-card-title>Recent Activities</va-card-title>
        <va-card-content>
          <va-list>
            <va-list-item v-for="(activity, index) in recentActivities" :key="index">
              <va-list-item-section avatar>
                <va-avatar :color="activity.color">
                  <va-icon :name="activity.icon" />
                </va-avatar>
              </va-list-item-section>
              <va-list-item-section>
                <va-list-item-label>{{ activity.text }}</va-list-item-label>
                <va-list-item-label caption>{{ activity.time }}</va-list-item-label>
              </va-list-item-section>
            </va-list-item>
          </va-list>
        </va-card-content>
      </va-card>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DashboardCards from './cards/DashboardCards.vue';
import WorkflowChart from './cards/WorkflowChart.vue';
import UserGrowthChart from './cards/UserGrowthChart.vue';

const recentActivities = ref([
  { text: 'New user registered', time: '5 minutes ago', icon: 'person_add', color: 'primary' },
  { text: 'New workflow created', time: '1 hour ago', icon: 'add_task', color: 'success' },
  { text: 'Workflow paused', time: '2 hours ago', icon: 'pause', color: 'warning' },
  { text: 'Organization added', time: '1 day ago', icon: 'business', color: 'info' },
]);
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.page-title {
  font-size: 2.5rem;
  color: var(--va-primary);
}
</style>