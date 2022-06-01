<template>
  <Doughnut
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
  />
</template>

<script>
import { Doughnut } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import { mapGetters } from "vuex";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'mealPlanDoughnutChart',
  components: {
    Doughnut
  },
  props: {
    chartId: {
      type: String,
      default: 'meal-plan-doughnut-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    cssClasses: {
      type: String,
      default: ''
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: null
    },
  },
  data: () => ({
    loaded: false,
    chartData: {
      labels: ['Carbs', 'Protein', 'Fat'],
      datasets: [
        {
          backgroundColor: ['#E53935', '#1565C0', '#FF9100'],
          data: []
        }
      ]
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false
    },
  }),
  mounted() {
    setTimeout(() => this.updateChartData(), 0)
  },
  computed: {
    ...mapGetters('mealPlan', ['getSelectedPlan']),
    percentageCarbs() {
      return this.getSelectedPlan.proportions.CARBS
    },
    percentageProtein() {
      return this.getSelectedPlan.proportions.PROTEIN
    },
    percentageFat() {
      return this.getSelectedPlan.proportions.FAT
    },
  },
  methods: {
    updateChartData() {
      this.chartData.datasets[0].data = []
      for (let [,value] of Object.entries(this.getSelectedPlan.proportions)) this.chartData.datasets[0].data.push(value)
    }
  },
  watch: {
    getSelectedPlan() {
      this.updateChartData()
    },
    percentageCarbs() {
      this.updateChartData()
    },
    percentageProtein() {
      this.updateChartData()
    },
    percentageFat() {
      this.updateChartData()
    }
  },
}
</script>
