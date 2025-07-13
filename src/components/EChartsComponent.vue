<template>
  <div 
    ref="chartContainer" 
    :style="{ width: width, height: height }"
    class="echarts-container"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// 定义组件属性
const props = defineProps({
  // 图表配置选项
  option: {
    type: Object,
    required: true
  },
  // 图表宽度
  width: {
    type: String,
    default: '100%'
  },
  // 图表高度
  height: {
    type: String,
    default: '400px'
  },
  // 主题
  theme: {
    type: String,
    default: 'default'
  },
  // 是否自动调整大小
  autoResize: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits(['chartReady', 'chartClick', 'chartHover'])

// 响应式数据
const chartContainer = ref(null) // 图表容器引用
let chartInstance = null // ECharts实例

// 初始化图表
const initChart = async () => {
  if (!chartContainer.value) return
  
  try {
    // 销毁已存在的实例
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    
    // 创建新的ECharts实例
    chartInstance = echarts.init(chartContainer.value, props.theme)
    
    // 设置图表配置
    chartInstance.setOption(props.option, true)
    
    // 绑定事件监听器
    chartInstance.on('click', (params) => {
      emit('chartClick', params)
    })
    
    chartInstance.on('mouseover', (params) => {
      emit('chartHover', params)
    })
    
    // 触发图表就绪事件
    emit('chartReady', chartInstance)
    
    // 自动调整大小
    if (props.autoResize) {
      window.addEventListener('resize', handleResize)
    }
  } catch (error) {
    console.error('ECharts初始化失败:', error)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 更新图表配置
const updateChart = () => {
  if (chartInstance && props.option) {
    chartInstance.setOption(props.option, true)
  }
}

// 监听配置变化
watch(
  () => props.option,
  () => {
    updateChart()
  },
  { deep: true }
)

// 监听主题变化
watch(
  () => props.theme,
  () => {
    initChart()
  }
)

// 组件挂载时初始化图表
onMounted(async () => {
  await nextTick()
  initChart()
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  if (props.autoResize) {
    window.removeEventListener('resize', handleResize)
  }
})

// 暴露方法给父组件
defineExpose({
  // 获取图表实例
  getChartInstance: () => chartInstance,
  // 手动调整大小
  resize: () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  },
  // 重新初始化图表
  reinit: initChart
})
</script>

<style scoped>
.echarts-container {
  /* 确保容器有明确的尺寸 */
  min-height: 200px;
  /* 防止图表溢出 */
  overflow: hidden;
  /* 添加边框以便调试 */
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  /* 背景色 */
  background-color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .echarts-container {
    height: 300px !important;
  }
}
</style>
