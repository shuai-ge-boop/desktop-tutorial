<template>
	<div class="status-statistics-container">
		<!-- 页面标题 -->
		<div class="page-header">
			<h1>📊 用户状态统计</h1>
			<p>查看系统中用户的状态分布和活跃情况</p>
		</div>

		<!-- 统计卡片 -->
		<el-row :gutter="20" class="stats-row">
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card active-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<CircleCheckFilled />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ (statusStats && statusStats.active) || 0 }}</div>
							<div class="stat-label">正常用户</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card disabled-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<CircleCloseFilled />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ (statusStats && statusStats.disabled) || 0 }}</div>
							<div class="stat-label">禁用用户</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card total-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<DataAnalysis />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ totalUsers }}</div>
							<div class="stat-label">总用户数</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card rate-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<TrendCharts />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ activeRate }}%</div>
							<div class="stat-label">活跃率</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 图表区域 -->
		<el-row :gutter="20" class="charts-row">
			<el-col :xs="24" :lg="12">
				<el-card class="chart-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>📊 状态分布柱状图</span>
							<el-button type="primary" size="small" @click="refreshChart">
								<el-icon>
									<Refresh />
								</el-icon>
								刷新
							</el-button>
						</div>
					</template>
					<EChartsComponent :option="barChartOption" height="400px" @chart-click="onChartClick" />
				</el-card>
			</el-col>
			<el-col :xs="24" :lg="12">
				<el-card class="chart-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>🥧 状态分布饼图</span>
							<el-button type="success" size="small" @click="refreshChart">
								<el-icon>
									<Refresh />
								</el-icon>
								刷新
							</el-button>
						</div>
					</template>
					<EChartsComponent :option="pieChartOption" height="400px" @chart-click="onChartClick" />
				</el-card>
			</el-col>
		</el-row>

		<!-- 趋势图表 -->
		<el-card class="trend-card" shadow="hover">
			<template #header>
				<div class="card-header">
					<span>📈 用户状态趋势</span>
					<div class="header-actions">
						<el-radio-group v-model="trendPeriod" size="small" @change="updateTrendChart">
							<el-radio-button label="7d">最近7天</el-radio-button>
							<el-radio-button label="30d">最近30天</el-radio-button>
							<el-radio-button label="90d">最近90天</el-radio-button>
						</el-radio-group>
					</div>
				</div>
			</template>
			<EChartsComponent :option="trendChartOption" height="300px" />
		</el-card>

		<!-- 详细数据表格 -->
		<el-card class="table-card" shadow="hover">
			<template #header>
				<span>📋 状态分布详情</span>
			</template>
			<el-table :data="statusTableData" style="width: 100%">
				<el-table-column prop="status" label="状态类型" width="150">
					<template #default="{ row }">
						<el-tag :type="getStatusTagType(row.status)" size="large">
							{{ getStatusText(row.status) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="count" label="用户数量" width="120">
					<template #default="{ row }">
						<span class="count-text">{{ row.count }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="percentage" label="占比" width="120">
					<template #default="{ row }">
						<span class="percentage-text">{{ row.percentage }}%</span>
					</template>
				</el-table-column>
				<el-table-column prop="description" label="状态描述">
					<template #default="{ row }">
						<span class="description-text">{{ row.description }}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
	CircleCheckFilled,
	CircleCloseFilled,
	DataAnalysis,
	TrendCharts,
	Refresh
} from '@element-plus/icons-vue'
import { useUserDataStore } from '@/stores/userData'
import EChartsComponent from '@/components/EChartsComponent.vue'

// 使用用户数据状态管理
const userDataStore = useUserDataStore()
const { statusStats, getStatusText } = userDataStore

// 趋势图时间周期
const trendPeriod = ref('7d')

// 计算总用户数
const totalUsers = computed(() => {
	// 添加空值检查，防止statusStats.value为undefined或null时出错
	if (!statusStats.value || typeof statusStats.value !== 'object') {
		return 0
	}
	return Object.values(statusStats.value).reduce((sum, count) => sum + count, 0)
})

// 计算活跃率
const activeRate = computed(() => {
	const total = totalUsers.value
	const active = (statusStats.value && statusStats.value.active) || 0
	return total > 0 ? ((active / total) * 100).toFixed(1) : '0.0'
})

// 柱状图配置
const barChartOption = computed(() => {
	return {
		title: {
			text: '用户状态统计',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' }
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			top: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: ['正常', '禁用']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name: '用户数量',
				type: 'bar',
				data: [
					{ value: (statusStats.value && statusStats.value.active) || 0, itemStyle: { color: '#67c23a' } },
					{ value: (statusStats.value && statusStats.value.disabled) || 0, itemStyle: { color: '#f56c6c' } }
				],
				barWidth: '60%'
			}
		]
	}
})

// 饼图配置
const pieChartOption = computed(() => {
	return {
		title: {
			text: '用户状态分布',
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' }
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
				name: '状态分布',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['60%', '60%'],
				data: [
					{ value: (statusStats.value && statusStats.value.active) || 0, name: '正常', itemStyle: { color: '#67c23a' } },
					{ value: (statusStats.value && statusStats.value.disabled) || 0, name: '禁用', itemStyle: { color: '#f56c6c' } }
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				},
				label: {
					show: true,
					formatter: '{b}: {c}'
				}
			}
		]
	}
})

// 趋势图配置
const trendChartOption = computed(() => {
	// 模拟趋势数据
	const generateTrendData = (period) => {
		const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
		const dates = []
		const activeData = []
		const disabledData = []

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			dates.push(date.toLocaleDateString())

			// 模拟数据变化
			const baseActive = (statusStats.value && statusStats.value.active) || 0
			const baseDisabled = (statusStats.value && statusStats.value.disabled) || 0
			activeData.push(Math.max(0, baseActive + Math.floor(Math.random() * 10 - 5)))
			disabledData.push(Math.max(0, baseDisabled + Math.floor(Math.random() * 3 - 1)))
		}

		return { dates, activeData, disabledData }
	}

	const { dates, activeData, disabledData } = generateTrendData(trendPeriod.value)

	return {
		title: {
			text: `用户状态趋势 (${trendPeriod.value === '7d' ? '最近7天' : trendPeriod.value === '30d' ? '最近30天' : '最近90天'})`,
			left: 'center',
			textStyle: { fontSize: 16, fontWeight: 'bold' }
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['正常用户', '禁用用户'],
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
			data: dates
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name: '正常用户',
				type: 'line',
				data: activeData,
				smooth: true,
				itemStyle: { color: '#67c23a' },
				areaStyle: { opacity: 0.3 }
			},
			{
				name: '禁用用户',
				type: 'line',
				data: disabledData,
				smooth: true,
				itemStyle: { color: '#f56c6c' },
				areaStyle: { opacity: 0.3 }
			}
		]
	}
})

// 表格数据
const statusTableData = computed(() => {
	const total = totalUsers.value
	const activeCount = (statusStats.value && statusStats.value.active) || 0
	const disabledCount = (statusStats.value && statusStats.value.disabled) || 0

	return [
		{
			status: 'active',
			count: activeCount,
			percentage: total > 0 ? (activeCount / total * 100).toFixed(1) : '0.0',
			description: '正常状态的用户，可以正常使用系统所有功能'
		},
		{
			status: 'disabled',
			count: disabledCount,
			percentage: total > 0 ? (disabledCount / total * 100).toFixed(1) : '0.0',
			description: '已被禁用的用户，无法登录和使用系统功能'
		}
	]
})

// 获取状态标签类型
const getStatusTagType = (status) => {
	const types = {
		active: 'success',
		disabled: 'danger'
	}
	return types[status] || 'info'
}

// 刷新图表
const refreshChart = () => {
	ElMessage.success('图表数据已刷新')
}

// 更新趋势图表
const updateTrendChart = () => {
	ElMessage.info(`已切换到${trendPeriod.value === '7d' ? '最近7天' : trendPeriod.value === '30d' ? '最近30天' : '最近90天'}视图`)
}

// 图表点击事件
const onChartClick = (params) => {
	ElMessage.info(`点击了: ${params.name} - ${params.value}人`)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.status-statistics-container {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: 100vh;

	.page-header {
		margin-bottom: 20px;
		text-align: center;

		h1 {
			color: $text-color-primary;
			margin-bottom: 10px;
			font-size: 28px;
		}

		p {
			color: $text-color-secondary;
			font-size: 16px;
		}
	}

	.stats-row {
		margin-bottom: 20px;

		.stat-card {
			margin-bottom: 15px;
			border-radius: 8px;
			overflow: hidden;

			.stat-content {
				display: flex;
				align-items: center;
				padding: 10px;

				.stat-icon {
					font-size: 40px;
					margin-right: 15px;
				}

				.stat-info {
					.stat-value {
						font-size: 24px;
						font-weight: bold;
						margin-bottom: 5px;
					}

					.stat-label {
						font-size: 14px;
						color: $text-color-secondary;
					}
				}
			}

			&.active-card {
				.stat-icon {
					color: #67c23a;
				}

				.stat-value {
					color: #67c23a;
				}
			}

			&.disabled-card {
				.stat-icon {
					color: #f56c6c;
				}

				.stat-value {
					color: #f56c6c;
				}
			}

			&.total-card {
				.stat-icon {
					color: #409eff;
				}

				.stat-value {
					color: #409eff;
				}
			}

			&.rate-card {
				.stat-icon {
					color: #e6a23c;
				}

				.stat-value {
					color: #e6a23c;
				}
			}
		}
	}

	.charts-row {
		margin-bottom: 20px;

		.chart-card {
			margin-bottom: 15px;
			border-radius: 8px;

			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: 600;
				color: $text-color-primary;
			}
		}
	}

	.trend-card {
		margin-bottom: 20px;
		border-radius: 8px;

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 600;
			color: $text-color-primary;

			.header-actions {
				display: flex;
				align-items: center;
			}
		}
	}

	.table-card {
		border-radius: 8px;

		.count-text {
			font-weight: bold;
			color: $primary-color;
		}

		.percentage-text {
			font-weight: bold;
			color: $success-color;
		}

		.description-text {
			color: $text-color-secondary;
			line-height: 1.5;
		}
	}
}

// 响应式设计
@media (max-width: 768px) {
	.status-statistics-container {
		padding: 10px;

		.charts-row {
			.el-col {
				margin-bottom: 20px;
			}
		}

		.trend-card {
			.card-header {
				flex-direction: column;
				gap: 10px;
				align-items: flex-start;
			}
		}
	}
}
</style>
