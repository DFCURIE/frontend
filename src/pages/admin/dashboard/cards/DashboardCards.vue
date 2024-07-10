<!-- frontend/src/pages/admin/dashboard/cards/DashboardCards.vue -->
<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <va-card v-for="(item, index) in dashboardData" :key="index" class="dashboard-card">
        <va-card-content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-600">{{ item.title }}</h3>
              <h2 class="text-3xl font-bold mt-2">{{ item.value }}</h2>
            </div>
            <va-icon :name="item.icon" :color="item.color" size="large" />
          </div>
          <div class="mt-4">
            <va-progress-bar :model-value="item.progress" :color="item.color" />
          </div>
        </va-card-content>
      </va-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getDashboardData } from '../../../../services/api';
  
  const dashboardData = ref([]);
  
  onMounted(async () => {
    try {
      const response = await getDashboardData();
      if (response.status === 200) {
        dashboardData.value = [
          { title: 'Total Users', value: response.data.totalUser[0].data, icon: 'people', color: 'primary', progress: 75 },
          { title: 'Total Organizations', value: response.data.totalOrganization[0].data, icon: 'business', color: 'success', progress: 60 },
          { title: 'Total Workflows', value: response.data.totalWorkflow[0].data, icon: 'timeline', color: 'info', progress: 85 },
          { title: 'Paused Workflows', value: response.data.totalWorkflowInActv[0].data, icon: 'pause_circle_filled', color: 'warning', progress: 40 },
        ];
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  });
  </script>
  
  <style scoped>
  .dashboard-card {
    transition: all 0.3s ease;
  }
  
  .dashboard-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  </style>