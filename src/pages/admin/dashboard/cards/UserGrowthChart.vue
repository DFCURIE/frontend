<!-- frontend/src/pages/admin/dashboard/cards/UserGrowthChart.vue -->
<template>
    <va-card class="user-growth-chart">
      <va-card-title>User Growth</va-card-title>
      <va-card-content>
        <canvas ref="chartRef"></canvas>
      </va-card-content>
    </va-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  const chartRef = ref(null);
  
  onMounted(() => {
    new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Users',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  });
  </script>
  
  <style scoped>
  .user-growth-chart {
    height: 400px;
  }
  </style>