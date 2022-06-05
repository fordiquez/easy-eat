<template>
  <Pie
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
import { Pie } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import {mapGetters} from "vuex";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'dailyMacrosPieChart',
  components: {
    Pie
  },
  props: {
    chartId: {
      type: String,
      default: 'daily-macros-pie-chart'
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
      default: () => ({
        width: '300px'
      })
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
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
    }
  }),
  mounted() {
    setTimeout(() => this.updateChartData(), 0)
  },
  computed: {
    ...mapGetters('food', ['getDailyMacros']),
    totalDailyMacros() {
      return this.getDailyMacros.CARBS + this.getDailyMacros.PROTEIN + this.getDailyMacros.FAT
    },
    percentageCarbs() {
      return Math.round(this.getDailyMacros.CARBS * 100 / this.totalDailyMacros)
    },
    percentageProtein() {
      return Math.round(this.getDailyMacros.PROTEIN * 100 / this.totalDailyMacros)
    },
    percentageFat() {
      return Math.round(this.getDailyMacros.FAT * 100 / this.totalDailyMacros)
    },
  },
  methods: {
    updateChartData() {
      this.chartData.datasets[0].data = []
      this.chartData.datasets[0].data.push(this.percentageCarbs)
      this.chartData.datasets[0].data.push(this.percentageProtein)
      this.chartData.datasets[0].data.push(this.percentageFat)
    }
  },
  watch: {
    totalDailyMacros() {
      this.updateChartData()
    }
  },
}
</script>
