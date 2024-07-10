<!-- frontend/src/pages/admin/dashboard/cards/WorkflowChart.vue -->
<template>
    <va-card class="workflow-chart">
      <va-card-title>Workflow Status</va-card-title>
      <va-card-content>
        <canvas ref="chartRef"></canvas>
      </va-card-content>
    </va-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  import { getDashboardData } from '../../../../services/api';
  
  const chartRef = ref(null);
  
  onMounted(async () => {
    try {
      const response = await getDashboardData();
      if (response.status === 200) {
        const totalWorkflows = response.data.totalWorkflow[0].data;
        const pausedWorkflows = response.data.totalWorkflowInActv[0].data;
        const activeWorkflows = totalWorkflows - pausedWorkflows;
  
        new Chart(chartRef.value, {
          type: 'doughnut',
          data: {
            labels: ['Active Workflows', 'Paused Workflows'],
            datasets: [{
              data: [activeWorkflows, pausedWorkflows],
              backgroundColor: ['#4CAF50', '#FFC107'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  });
  </script>
  
  <style scoped>
  .workflow-chart {
    height: 400px;
  }
  </style>