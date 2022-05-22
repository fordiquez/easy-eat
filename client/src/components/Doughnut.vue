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
import {mapGetters} from "vuex";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'DoughnutChart',
  components: {
    Doughnut
  },
  props: {
    chartId: {
      type: String,
      default: 'doughnut-chart'
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
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
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
    }
  },
  created() {
    for (let [,value] of Object.entries(this.getUserDiet.proportions)) {
      this.chartData.datasets[0].data.push(value)
    }
  },
  computed: {
    ...mapGetters('userData', ['getUserDiet']),
    percentageCarbs() {
      return this.getUserDiet.proportions.CARBS
    },
    percentageProtein() {
      return this.getUserDiet.proportions.PROTEIN
    },
    percentageFat() {
      return this.getUserDiet.proportions.FAT
    },
  },
  methods: {
    updateChartData() {
      this.chartData.datasets[0].data = []
      for (let [,value] of Object.entries(this.getUserDiet.proportions)) {
        this.chartData.datasets[0].data.push(value)
      }
    }
  },
  watch: {
    getUserDiet() {
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
