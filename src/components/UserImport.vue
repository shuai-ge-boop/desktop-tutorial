<template>
	<el-dialog v-model="dialogVisible" title="批量导入用户" width="800px" :before-close="handleClose" destroy-on-close>
		<!-- 步骤条 -->
		<el-steps :active="currentStep" align-center class="import-steps">
			<el-step title="上传文件" />
			<el-step title="数据预览" />
			<el-step title="导入结果" />
		</el-steps>

		<!-- 步骤1：上传文件 -->
		<div v-if="currentStep === 0" class="step-content">
			<div class="upload-section">
				<div class="template-download">
					<h4>📋 导入说明</h4>
					<p>请先下载导入模板，按照模板格式填写用户数据后上传。</p>
					<el-button type="primary" :icon="Download" @click="downloadTemplate">
						下载导入模板
					</el-button>
				</div>

				<el-divider />

				<div class="file-upload">
					<h4>📁 上传文件</h4>
					<el-upload ref="uploadRef" class="upload-dragger" drag :auto-upload="false" :show-file-list="false"
						:on-change="handleFileChange" :before-upload="beforeUpload" accept=".xlsx,.xls,.csv">
						<el-icon class="el-icon--upload">
							<UploadFilled />
						</el-icon>
						<div class="el-upload__text">
							将文件拖到此处，或<em>点击上传</em>
						</div>
						<template #tip>
							<div class="el-upload__tip">
								支持 .xlsx、.xls、.csv 格式文件，文件大小不超过 10MB
							</div>
						</template>
					</el-upload>

					<div v-if="uploadFile" class="file-info">
						<el-icon>
							<Document />
						</el-icon>
						<span>{{ uploadFile.name }}</span>
						<el-button type="text" @click="removeFile">移除</el-button>
					</div>
				</div>
			</div>
		</div>

		<!-- 步骤2：数据预览 -->
		<div v-if="currentStep === 1" class="step-content">
			<div class="preview-section">
				<div class="preview-header">
					<h4>📊 数据预览</h4>
					<div class="preview-stats">
						<el-tag type="info">总计: {{ previewData.total }}</el-tag>
						<el-tag type="success">有效: {{ previewData.validCount }}</el-tag>
						<el-tag type="danger">错误: {{ previewData.errorCount }}</el-tag>
					</div>
				</div>

				<el-table :data="previewData.data" max-height="400" style="width: 100%"
					:row-class-name="getRowClassName">
					<el-table-column prop="rowIndex" label="行号" width="60" />
					<el-table-column prop="username" label="用户名" width="120" />
					<el-table-column prop="name" label="姓名" width="100" />
					<el-table-column prop="email" label="邮箱" width="180" />
					<el-table-column prop="phone" label="手机号" width="120" />
					<el-table-column prop="role" label="角色" width="100">
						<template #default="{ row }">
							{{ getRoleText(row.role) }}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="80">
						<template #default="{ row }">
							<el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
								{{ row.status === 'active' ? '正常' : '禁用' }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="错误信息" min-width="200">
						<template #default="{ row }">
							<div v-if="row.errors.length > 0" class="error-messages">
								<el-tag v-for="(error, index) in row.errors" :key="index" type="danger" size="small"
									class="error-tag">
									{{ error }}
								</el-tag>
							</div>
							<el-tag v-else type="success" size="small">数据正常</el-tag>
						</template>
					</el-table-column>
				</el-table>

				<div class="duplicate-check">
					<el-checkbox v-model="skipDuplicates">跳过重复数据</el-checkbox>
					<el-checkbox v-model="updateExisting">更新已存在的用户</el-checkbox>
				</div>
			</div>
		</div>

		<!-- 步骤3：导入结果 -->
		<div v-if="currentStep === 2" class="step-content">
			<div class="result-section">
				<div class="result-header">
					<el-icon class="result-icon" :class="importResult.success ? 'success' : 'error'">
						<component :is="importResult.success ? 'SuccessFilled' : 'CircleCloseFilled'" />
					</el-icon>
					<h4>{{ importResult.success ? '导入成功' : '导入失败' }}</h4>
				</div>

				<div class="result-stats">
					<div class="stat-item">
						<span class="label">总计:</span>
						<span class="value">{{ importResult.total }}</span>
					</div>
					<div class="stat-item">
						<span class="label">成功:</span>
						<span class="value success">{{ importResult.successCount }}</span>
					</div>
					<div class="stat-item">
						<span class="label">失败:</span>
						<span class="value error">{{ importResult.failCount }}</span>
					</div>
					<div class="stat-item">
						<span class="label">跳过:</span>
						<span class="value warning">{{ importResult.skipCount }}</span>
					</div>
				</div>

				<div v-if="importResult.errors.length > 0" class="error-details">
					<h5>错误详情:</h5>
					<ul>
						<li v-for="(error, index) in importResult.errors" :key="index">
							第{{ error.row }}行: {{ error.message }}
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 进度条 -->
		<div v-if="importing" class="import-progress">
			<el-progress :percentage="importProgress" :status="importProgress === 100 ? 'success' : ''" />
			<p>正在导入数据，请稍候...</p>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">
					{{ currentStep === 2 ? '关闭' : '取消' }}
				</el-button>

				<el-button v-if="currentStep === 0" type="primary" :disabled="!uploadFile" :loading="parsing"
					@click="parseFile">
					解析文件
				</el-button>

				<el-button v-if="currentStep === 1" type="primary" :disabled="previewData.validCount === 0"
					:loading="importing" @click="startImport">
					开始导入
				</el-button>

				<el-button v-if="currentStep === 2" type="primary" @click="resetImport">
					重新导入
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
	Download,
	UploadFilled,
	Document,
	SuccessFilled,
	CircleCloseFilled
} from '@element-plus/icons-vue'
import { generateImportTemplate, parseImportFile } from '@/utils/exportUtils'

// 定义组件属性
const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	}
})

// 定义事件
const emit = defineEmits(['update:visible', 'success'])

// 响应式数据
const dialogVisible = ref(false)
const currentStep = ref(0)
const uploadRef = ref(null)
const uploadFile = ref(null)
const parsing = ref(false)
const importing = ref(false)
const importProgress = ref(0)

// 预览数据
const previewData = reactive({
	data: [],
	total: 0,
	validCount: 0,
	errorCount: 0
})

// 导入选项
const skipDuplicates = ref(true)
const updateExisting = ref(false)

// 导入结果
const importResult = reactive({
	success: false,
	total: 0,
	successCount: 0,
	failCount: 0,
	skipCount: 0,
	errors: []
})

// 监听visible变化
watch(() => props.visible, (newVal) => {
	dialogVisible.value = newVal
	if (newVal) {
		resetImport()
	}
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
	emit('update:visible', newVal)
})

// 下载模板
const downloadTemplate = () => {
	const result = generateImportTemplate()
	if (result.success) {
		ElMessage.success(result.message)
	} else {
		ElMessage.error(result.message)
	}
}

// 文件上传前验证
const beforeUpload = (file) => {
	const isValidType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-excel',
		'text/csv'].includes(file.type)
	const isLt10M = file.size / 1024 / 1024 < 10

	if (!isValidType) {
		ElMessage.error('只支持 Excel 和 CSV 格式文件!')
		return false
	}
	if (!isLt10M) {
		ElMessage.error('文件大小不能超过 10MB!')
		return false
	}
	return false // 阻止自动上传
}

// 文件选择
const handleFileChange = (file) => {
	uploadFile.value = file
}

// 移除文件
const removeFile = () => {
	uploadFile.value = null
	if (uploadRef.value) {
		uploadRef.value.clearFiles()
	}
}

// 解析文件
const parseFile = async () => {
	if (!uploadFile.value) {
		ElMessage.warning('请先选择文件')
		return
	}

	parsing.value = true
	try {
		const result = await parseImportFile(uploadFile.value.raw)

		if (result.success) {
			Object.assign(previewData, result)
			currentStep.value = 1
			ElMessage.success('文件解析成功')
		} else {
			ElMessage.error(result.message)
		}
	} catch (error) {
		ElMessage.error('文件解析失败')
	} finally {
		parsing.value = false
	}
}

// 开始导入
const startImport = async () => {
	importing.value = true
	importProgress.value = 0

	try {
		// 过滤有效数据
		const validData = previewData.data.filter(item => item.errors.length === 0)

		// 模拟导入过程
		let successCount = 0
		let failCount = 0
		let skipCount = 0
		const errors = []

		for (let i = 0; i < validData.length; i++) {
			// 更新进度
			importProgress.value = Math.round(((i + 1) / validData.length) * 100)

			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 100))

			// 模拟导入结果（90%成功率）
			if (Math.random() > 0.1) {
				successCount++
			} else {
				failCount++
				errors.push({
					row: validData[i].rowIndex,
					message: '用户名已存在'
				})
			}
		}

		// 设置导入结果
		Object.assign(importResult, {
			success: failCount === 0,
			total: validData.length,
			successCount,
			failCount,
			skipCount,
			errors
		})

		currentStep.value = 2

		if (successCount > 0) {
			emit('success')
		}

	} catch (error) {
		ElMessage.error('导入过程中发生错误')
	} finally {
		importing.value = false
	}
}

// 获取行样式
const getRowClassName = ({ row }) => {
	return row.errors.length > 0 ? 'error-row' : ''
}

// 获取角色文本
const getRoleText = (role) => {
	const roleMap = {
		admin: '管理员',
		moderator: '版主',
		user: '普通用户'
	}
	return roleMap[role] || '未知'
}

// 重置导入
const resetImport = () => {
	currentStep.value = 0
	uploadFile.value = null
	parsing.value = false
	importing.value = false
	importProgress.value = 0

	Object.assign(previewData, {
		data: [],
		total: 0,
		validCount: 0,
		errorCount: 0
	})

	Object.assign(importResult, {
		success: false,
		total: 0,
		successCount: 0,
		failCount: 0,
		skipCount: 0,
		errors: []
	})

	if (uploadRef.value) {
		uploadRef.value.clearFiles()
	}
}

// 关闭对话框
const handleClose = () => {
	dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.import-steps {
	margin-bottom: 30px;
}

.step-content {
	min-height: 400px;
	padding: 20px 0;
}

.upload-section {
	.template-download {
		text-align: center;
		padding: 20px;
		background: #f8f9fa;
		border-radius: 6px;
		margin-bottom: 20px;

		h4 {
			margin-bottom: 10px;
			color: #303133;
		}

		p {
			margin-bottom: 15px;
			color: #606266;
		}
	}

	.file-upload {
		.upload-dragger {
			width: 100%;
		}

		.file-info {
			margin-top: 15px;
			padding: 10px;
			background: #f0f9ff;
			border-radius: 4px;
			display: flex;
			align-items: center;
			gap: 10px;

			.el-icon {
				color: #409eff;
			}
		}
	}
}

.preview-section {
	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		.preview-stats {
			display: flex;
			gap: 10px;
		}
	}

	.duplicate-check {
		margin-top: 15px;
		display: flex;
		gap: 20px;
	}
}

.result-section {
	text-align: center;

	.result-header {
		margin-bottom: 30px;

		.result-icon {
			font-size: 48px;
			margin-bottom: 15px;

			&.success {
				color: #67c23a;
			}

			&.error {
				color: #f56c6c;
			}
		}

		h4 {
			font-size: 18px;
			margin: 0;
		}
	}

	.result-stats {
		display: flex;
		justify-content: center;
		gap: 30px;
		margin-bottom: 30px;

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.label {
				font-size: 14px;
				color: #909399;
				margin-bottom: 5px;
			}

			.value {
				font-size: 24px;
				font-weight: bold;

				&.success {
					color: #67c23a;
				}

				&.error {
					color: #f56c6c;
				}

				&.warning {
					color: #e6a23c;
				}
			}
		}
	}

	.error-details {
		text-align: left;
		background: #fef0f0;
		padding: 15px;
		border-radius: 4px;

		h5 {
			margin-bottom: 10px;
			color: #f56c6c;
		}

		ul {
			margin: 0;
			padding-left: 20px;

			li {
				margin-bottom: 5px;
				color: #606266;
			}
		}
	}
}

.import-progress {
	margin: 20px 0;
	text-align: center;

	p {
		margin-top: 10px;
		color: #606266;
	}
}

.error-messages {
	.error-tag {
		margin-right: 5px;
		margin-bottom: 2px;
	}
}

:deep(.error-row) {
	background-color: #fef0f0;
}

.dialog-footer {
	text-align: right;
}
</style>
