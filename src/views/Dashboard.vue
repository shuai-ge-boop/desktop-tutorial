<template>
    <div class="dashboard-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h1>系统首页</h1>
            <p>欢迎使用后台管理系统</p>
        </div>

        <!-- 数据统计卡片 -->
        <el-row :gutter="20" class="stats-row">
            <el-col :xs="24" :sm="12" :md="6" v-for="stat in stats" :key="stat.title">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon" :style="{ backgroundColor: stat.color }">
                            <el-icon :size="24" :color="'#fff'">
                                <component :is="stat.icon" />
                            </el-icon>
                        </div>
                        <div class="stat-info">
                            <h3>{{ stat.value }}</h3>
                            <p>{{ stat.title }}</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="20" class="chart-row">
            <el-col :xs="24" :md="12">
                <el-card class="chart-card">
                    <template #header>
                        <h3>用户增长趋势</h3>
                    </template>
                    <EChartsComponent 
                        :option="userGrowthOption" 
                        height="200px"
                        @chartReady="handleChartReady"
                        @chartClick="handleChartClick"
                    />
                </el-card>
            </el-col>

            <el-col :xs="24" :md="12">
                <el-card class="chart-card">
                    <template #header>
                        <h3>系统状态</h3>
                    </template>
                    <div class="system-status">
                        <div class="status-item">
                            <span class="status-label">CPU使用率</span>
                            <el-progress :percentage="cpuUsage" :color="getProgressColor(cpuUsage)" />
                        </div>
                        <div class="status-item">
                            <span class="status-label">内存使用率</span>
                            <el-progress :percentage="memoryUsage" :color="getProgressColor(memoryUsage)" />
                        </div>
                        <div class="status-item">
                            <span class="status-label">磁盘使用率</span>
                            <el-progress :percentage="diskUsage" :color="getProgressColor(diskUsage)" />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 快捷操作 -->
        <el-card class="quick-actions">
            <template #header>
                <h3>快捷操作</h3>
            </template>
            <div class="actions-grid">
                <div class="action-item" v-for="action in quickActions" :key="action.name">
                    <el-button :type="action.type" :icon="action.icon" @click="handleAction(action.action)"
                        size="large">
                        {{ action.name }}
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
    User,
    Document,
    DataAnalysis,
    Setting,
    TrendCharts,
    Plus,
    Refresh,
    Download,
    Upload
} from '@element-plus/icons-vue'
import EChartsComponent from '@/components/EChartsComponent.vue'

// 统计数据
const stats = ref([
    {
        title: '用户总数',
        value: '1,234',
        icon: User,
        color: '#409eff'
    },
    {
        title: '文档总数',
        value: '567',
        icon: Document,
        color: '#67c23a'
    },
    {
        title: '数据分析',
        value: '89',
        icon: DataAnalysis,
        color: '#e6a23c'
    },
    {
        title: '系统设置',
        value: '12',
        icon: Setting,
        color: '#f56c6c'
    }
])

// 系统状态
const cpuUsage = ref(45)
const memoryUsage = ref(67)
const diskUsage = ref(32)

// 快捷操作
const quickActions = ref([
    {
        name: '新增用户',
        type: 'primary',
        icon: Plus,
        action: 'add-user'
    },
    {
        name: '刷新数据',
        type: 'success',
        icon: Refresh,
        action: 'refresh'
    },
    {
        name: '数据导出',
        type: 'warning',
        icon: Download,
        action: 'export'
    },
    {
        name: '数据导入',
        type: 'info',
        icon: Upload,
        action: 'import'
    }
])

// 用户增长趋势图表配置
const userGrowthOption = ref({
    title: {
        text: '用户增长趋势',
        left: 'center',
        textStyle: {
            fontSize: 14,
            color: '#303133'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {
        data: ['新增用户', '活跃用户'],
        bottom: 10
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '新增用户',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
        },
        {
            name: '活跃用户',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149]
        }
    ]
})

// 获取进度条颜色
const getProgressColor = (percentage) => {
    if (percentage < 50) return '#67c23a'
    if (percentage < 80) return '#e6a23c'
    return '#f56c6c'
}

// 处理快捷操作
const handleAction = (action) => {
    switch (action) {
        case 'add-user':
            ElMessage.info('新增用户功能开发中...')
            break
        case 'refresh':
            ElMessage.success('数据刷新成功')
            refreshData()
            break
        case 'export':
            ElMessage.info('数据导出功能开发中...')
            break
        case 'import':
            ElMessage.info('数据导入功能开发中...')
            break
    }
}

// 刷新数据
const refreshData = () => {
    // 模拟数据刷新
    cpuUsage.value = Math.floor(Math.random() * 100)
    memoryUsage.value = Math.floor(Math.random() * 100)
    diskUsage.value = Math.floor(Math.random() * 100)
}

// 图表就绪事件
const handleChartReady = (chartInstance) => {
    console.log('图表已就绪', chartInstance)
}

// 图表点击事件
const handleChartClick = (params) => {
    ElMessage.info(`点击了 ${params.seriesName}: ${params.value}`)
}

// 组件挂载时模拟数据加载
onMounted(() => {
    refreshData()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.dashboard-container {
    .page-header {
        margin-bottom: 30px;

        h1 {
            font-size: 28px;
            color: $text-color-primary;
            margin-bottom: 8px;
        }

        p {
            color: $text-color-secondary;
            font-size: 14px;
        }
    }

    .stats-row {
        margin-bottom: 20px;

        .stat-card {
            height: 120px;

            .stat-content {
                display: flex;
                align-items: center;
                height: 100%;

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20px;
                }

                .stat-info {
                    flex: 1;

                    h3 {
                        font-size: 24px;
                        color: $text-color-primary;
                        margin-bottom: 5px;
                    }

                    p {
                        color: $text-color-secondary;
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .chart-row {
        margin-bottom: 20px;

        .chart-card {
            height: 300px;

            .chart-placeholder {
                height: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: $text-color-secondary;

                p {
                    margin-top: 10px;
                    font-size: 14px;
                }
            }

            .system-status {
                padding: 20px 0;

                .status-item {
                    margin-bottom: 20px;

                    .status-label {
                        display: inline-block;
                        width: 100px;
                        color: $text-color-regular;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }

    .quick-actions {
        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;

            .action-item {
                display: flex;
                justify-content: center;

                .el-button {
                    width: 100%;
                    height: 50px;
                }
            }
        }
    }
}

// 响应式样式
@media (max-width: $mobile) {
    .dashboard-container {
        .stats-row {
            .stat-card {
                margin-bottom: 15px;
            }
        }

        .chart-row {
            .chart-card {
                margin-bottom: 15px;
            }
        }

        .quick-actions {
            .actions-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }
}
</style>