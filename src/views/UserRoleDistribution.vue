<template>
	<div class="role-distribution-container">
		<!-- 页面标题 -->
		<div class="page-header">
			<h1>👥 用户角色分布</h1>
			<p>查看系统中不同角色用户的分布情况</p>
		</div>

		<!-- 统计卡片 -->
		<el-row :gutter="20" class="stats-row">
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card admin-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<UserFilled />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ (roleStats && roleStats.admin) || 0 }}</div>
							<div class="stat-label">管理员</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card moderator-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<Star />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ (roleStats && roleStats.moderator) || 0 }}</div>
							<div class="stat-label">版主</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="8" :md="6">
				<el-card class="stat-card user-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon">
							<el-icon>
								<User />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-value">{{ (roleStats && roleStats.user) || 0 }}</div>
							<div class="stat-label">普通用户</div>
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
		</el-row>

		<!-- 图表区域 -->
		<el-row :gutter="20" class="charts-row">
			<el-col :xs="24" :lg="12">
				<el-card class="chart-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>🥧 角色分布饼图</span>
							<el-button type="primary" size="small" @click="refreshChart">
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
			<el-col :xs="24" :lg="12">
				<el-card class="chart-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>📊 角色分布柱状图</span>
							<el-button type="success" size="small" @click="refreshChart">
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
		</el-row>

		<!-- 详细数据表格 -->
		<el-card class="table-card" shadow="hover">
			<template #header>
				<span>📋 角色分布详情</span>
			</template>
			<el-table :data="roleTableData" style="width: 100%">
				<el-table-column prop="role" label="角色类型" width="150">
					<template #default="{ row }">
						<el-tag :type="getRoleTagType(row.role)" size="large">
							{{ getRoleText(row.role) }}
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
				<el-table-column prop="description" label="角色描述">
					<template #default="{ row }">
						<span class="description-text">{{ row.description }}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
	UserFilled,
	Star,
	User,
	DataAnalysis,
	Refresh
} from '@element-plus/icons-vue'
import { useUserDataStore } from '@/stores/userData'
import EChartsComponent from '@/components/EChartsComponent.vue'

// 使用用户数据状态管理
const userDataStore = useUserDataStore()
const { roleStats, getRoleText } = userDataStore

// 计算总用户数
const totalUsers = computed(() => {
	// 添加空值检查，防止roleStats.value为undefined或null时出错
	if (!roleStats.value || typeof roleStats.value !== 'object') {
		return 0
	}
	return Object.values(roleStats.value).reduce((sum, count) => sum + count, 0)
})

// 饼图配置
const pieChartOption = computed(() => {
	return {
		title: {
			text: '用户角色分布',
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
				name: '角色分布',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['60%', '60%'],
				data: [
					{ value: (roleStats.value && roleStats.value.admin) || 0, name: '管理员', itemStyle: { color: '#f56c6c' } },
					{ value: (roleStats.value && roleStats.value.moderator) || 0, name: '版主', itemStyle: { color: '#e6a23c' } },
					{ value: (roleStats.value && roleStats.value.user) || 0, name: '普通用户', itemStyle: { color: '#409eff' } }
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

// 柱状图配置
const barChartOption = computed(() => {
	return {
		title: {
			text: '用户角色统计',
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
			data: ['管理员', '版主', '普通用户']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name: '用户数量',
				type: 'bar',
				data: [
					{ value: (roleStats.value && roleStats.value.admin) || 0, itemStyle: { color: '#f56c6c' } },
					{ value: (roleStats.value && roleStats.value.moderator) || 0, itemStyle: { color: '#e6a23c' } },
					{ value: (roleStats.value && roleStats.value.user) || 0, itemStyle: { color: '#409eff' } }
				],
				barWidth: '60%'
			}
		]
	}
})

// 表格数据
const roleTableData = computed(() => {
	const total = totalUsers.value
	const adminCount = (roleStats.value && roleStats.value.admin) || 0
	const moderatorCount = (roleStats.value && roleStats.value.moderator) || 0
	const userCount = (roleStats.value && roleStats.value.user) || 0

	return [
		{
			role: 'admin',
			count: adminCount,
			percentage: total > 0 ? (adminCount / total * 100).toFixed(1) : '0.0',
			description: '系统管理员，拥有最高权限，可以管理所有系统功能'
		},
		{
			role: 'moderator',
			count: moderatorCount,
			percentage: total > 0 ? (moderatorCount / total * 100).toFixed(1) : '0.0',
			description: '版主，负责内容审核和用户管理，权限次于管理员'
		},
		{
			role: 'user',
			count: userCount,
			percentage: total > 0 ? (userCount / total * 100).toFixed(1) : '0.0',
			description: '普通用户，可以使用基本功能，权限受限'
		}
	]
})

// 获取角色标签类型
const getRoleTagType = (role) => {
	const types = {
		admin: 'danger',
		moderator: 'warning',
		user: 'info'
	}
	return types[role] || 'info'
}

// 刷新图表
const refreshChart = () => {
	ElMessage.success('图表数据已刷新')
}

// 图表点击事件
const onChartClick = (params) => {
	ElMessage.info(`点击了: ${params.name} - ${params.value}人`)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.role-distribution-container {
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

			&.admin-card {
				.stat-icon {
					color: #f56c6c;
				}

				.stat-value {
					color: #f56c6c;
				}
			}

			&.moderator-card {
				.stat-icon {
					color: #e6a23c;
				}

				.stat-value {
					color: #e6a23c;
				}
			}

			&.user-card {
				.stat-icon {
					color: #409eff;
				}

				.stat-value {
					color: #409eff;
				}
			}

			&.total-card {
				.stat-icon {
					color: #67c23a;
				}

				.stat-value {
					color: #67c23a;
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
	.role-distribution-container {
		padding: 10px;

		.charts-row {
			.el-col {
				margin-bottom: 20px;
			}
		}
	}
}
</style>
