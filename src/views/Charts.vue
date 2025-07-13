<template>
  <div class="charts-container">
    <el-card class="page-header" shadow="never">
      <h1>📊 ECharts 图表展示</h1>
      <p>这里展示了ECharts在Vue3项目中的集成和使用示例</p>
    </el-card>

    <div class="charts-grid">
      <!-- 柱状图 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>📈 销售数据柱状图</span>
            <el-button type="primary" size="small" @click="refreshBarChart">
              刷新数据
            </el-button>
          </div>
        </template>
        <EChartsComponent
          :option="barChartOption"
          height="350px"
          @chart-ready="onChartReady"
          @chart-click="onChartClick"
        />
      </el-card>

      <!-- 饼图 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>🥧 市场份额饼图</span>
            <el-button type="success" size="small" @click="refreshPieChart">
              刷新数据
            </el-button>
          </div>
        </template>
        <EChartsComponent
          :option="pieChartOption"
          height="350px"
          @chart-click="onPieClick"
        />
      </el-card>

      <!-- 折线图 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>📉 趋势分析折线图</span>
            <el-button type="warning" size="small" @click="refreshLineChart">
              刷新数据
            </el-button>
          </div>
        </template>
        <EChartsComponent
          :option="lineChartOption"
          height="350px"
        />
      </el-card>

      <!-- 雷达图 */
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>🎯 能力评估雷达图</span>
            <el-button type="info" size="small" @click="refreshRadarChart">
              刷新数据
            </el-button>
          </div>
        </template>
        <EChartsComponent
          :option="radarChartOption"
          height="350px"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import EChartsComponent from '@/components/EChartsComponent.vue'

// 柱状图配置
const barChartOption = reactive({
  title: {
    text: '月度销售数据',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['销售额', '利润'],
    top: '10%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: {
        color: '#5470c6'
      }
    },
    {
      name: '利润',
      type: 'bar',
      data: [60, 100, 75, 40, 35, 55],
      itemStyle: {
        color: '#91cc75'
      }
    }
  ]
})

// 饼图配置
const pieChartOption = reactive({
  title: {
    text: '产品市场份额',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: '15%'
  },
  series: [
    {
      name: '市场份额',
      type: 'pie',
      radius: '50%',
      center: ['60%', '60%'],
      data: [
        { value: 1048, name: '产品A' },
        { value: 735, name: '产品B' },
        { value: 580, name: '产品C' },
        { value: 484, name: '产品D' },
        { value: 300, name: '产品E' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

// 折线图配置
const lineChartOption = reactive({
  title: {
    text: '用户增长趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新用户', '活跃用户'],
    top: '10%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新用户',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true,
      itemStyle: {
        color: '#ee6666'
      }
    },
    {
      name: '活跃用户',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
      smooth: true,
      itemStyle: {
        color: '#3ba272'
      }
    }
  ]
})

// 雷达图配置
const radarChartOption = reactive({
  title: {
    text: '技能评估',
    left: 'center'
  },
  tooltip: {},
  legend: {
    data: ['前端技能', '后端技能'],
    top: '10%'
  },
  radar: {
    indicator: [
      { name: 'JavaScript', max: 100 },
      { name: 'Vue.js', max: 100 },
      { name: 'CSS', max: 100 },
      { name: 'Node.js', max: 100 },
      { name: '数据库', max: 100 },
      { name: '项目管理', max: 100 }
    ]
  },
  series: [
    {
      name: '技能评估',
      type: 'radar',
      data: [
        {
          value: [80, 90, 85, 70, 75, 80],
          name: '前端技能'
        },
        {
          value: [70, 60, 65, 85, 90, 75],
          name: '后端技能'
        }
      ]
    }
  ]
})

// 生成随机数据
const generateRandomData = (length, min = 50, max = 300) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

// 刷新柱状图数据
const refreshBarChart = () => {
  barChartOption.series[0].data = generateRandomData(6, 80, 250)
  barChartOption.series[1].data = generateRandomData(6, 40, 120)
  ElMessage.success('柱状图数据已刷新')
}

// 刷新饼图数据
const refreshPieChart = () => {
  const newData = generateRandomData(5, 200, 1200)
  pieChartOption.series[0].data.forEach((item, index) => {
    item.value = newData[index]
  })
  ElMessage.success('饼图数据已刷新')
}

// 刷新折线图数据
const refreshLineChart = () => {
  lineChartOption.series[0].data = generateRandomData(7, 80, 250)
  lineChartOption.series[1].data = generateRandomData(7, 150, 350)
  ElMessage.success('折线图数据已刷新')
}

// 刷新雷达图数据
const refreshRadarChart = () => {
  radarChartOption.series[0].data[0].value = generateRandomData(6, 60, 95)
  radarChartOption.series[0].data[1].value = generateRandomData(6, 60, 95)
  ElMessage.success('雷达图数据已刷新')
}

// 图表事件处理
const onChartReady = (chartInstance) => {
  console.log('图表已准备就绪:', chartInstance)
}

const onChartClick = (params) => {
  ElMessage.info(`点击了: ${params.name} - ${params.value}`)
}

const onPieClick = (params) => {
  ElMessage.info(`点击了饼图: ${params.name} - ${params.value} (${params.percent}%)`)
}
</script>

<style scoped>
.charts-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
  text-align: center;
}

.page-header h1 {
  color: #303133;
  margin-bottom: 10px;
  font-size: 28px;
}

.page-header p {
  color: #606266;
  font-size: 16px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    padding: 10px;
  }
}
</style>
