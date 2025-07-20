<template>
	<el-dialog
		v-model="dialogVisible"
		:title="isEdit ? '编辑用户' : '新增用户'"
		width="800px"
		:before-close="handleClose"
		destroy-on-close
		class="user-form-dialog"
		align-center
	>
		<div class="user-form-container">
			<!-- 头像区域 -->
			<div class="avatar-section">
				<div class="avatar-upload">
					<el-upload
						class="avatar-uploader"
						:show-file-list="false"
						:before-upload="beforeAvatarUpload"
						:on-success="handleAvatarSuccess"
						action="#"
						:auto-upload="false"
						:on-change="handleAvatarChange"
					>
						<div class="avatar-container">
							<img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
							<div v-else class="avatar-placeholder">
								<el-icon class="avatar-uploader-icon">
									<User />
								</el-icon>
								<span class="upload-text">点击上传头像</span>
							</div>
						</div>
					</el-upload>
					<div class="avatar-tips">
						<el-icon class="tip-icon"><InfoFilled /></el-icon>
						<span>支持 JPG、PNG 格式，文件大小不超过 2MB</span>
					</div>
				</div>
			</div>

			<!-- 表单区域 -->
			<div class="form-section">
				<el-form
					ref="formRef"
					:model="formData"
					:rules="formRules"
					label-width="90px"
					label-position="top"
					class="user-form"
				>
					<!-- 基本信息 -->
					<div class="form-group">
						<div class="group-title">
							<el-icon><User /></el-icon>
							<span>基本信息</span>
						</div>
						<el-row :gutter="20">
							<el-col :xs="24" :sm="12">
								<el-form-item label="用户名" prop="username">
									<el-input
										v-model="formData.username"
										placeholder="请输入用户名"
										:disabled="isEdit"
										maxlength="20"
										show-word-limit
										:prefix-icon="User"
									/>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12">
								<el-form-item label="真实姓名" prop="name">
									<el-input
										v-model="formData.name"
										placeholder="请输入真实姓名"
										maxlength="20"
										show-word-limit
										:prefix-icon="User"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</div>

					<!-- 联系信息 -->
					<div class="form-group">
						<div class="group-title">
							<el-icon><Message /></el-icon>
							<span>联系信息</span>
						</div>
						<el-row :gutter="20">
							<el-col :xs="24" :sm="12">
								<el-form-item label="邮箱地址" prop="email">
									<el-input
										v-model="formData.email"
										placeholder="请输入邮箱地址"
										type="email"
										:prefix-icon="Message"
									/>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12">
								<el-form-item label="手机号码" prop="phone">
									<el-input
										v-model="formData.phone"
										placeholder="请输入手机号码"
										maxlength="11"
										:prefix-icon="Phone"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</div>

					<!-- 权限设置 -->
					<div class="form-group">
						<div class="group-title">
							<el-icon><Setting /></el-icon>
							<span>权限设置</span>
						</div>
						<el-row :gutter="20">
							<el-col :xs="24" :sm="12">
								<el-form-item label="用户角色" prop="role">
									<el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
										<el-option label="管理员" value="admin">
											<div class="option-item">
												<el-icon><UserFilled /></el-icon>
												<span>管理员</span>
											</div>
										</el-option>
										<el-option label="版主" value="moderator">
											<div class="option-item">
												<el-icon><Star /></el-icon>
												<span>版主</span>
											</div>
										</el-option>
										<el-option label="普通用户" value="user">
											<div class="option-item">
												<el-icon><User /></el-icon>
												<span>普通用户</span>
											</div>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12">
								<el-form-item label="账户状态" prop="status">
									<div class="status-button-group">
										<el-button
											class="status-button"
											:class="{ 'is-active': formData.status === 'active' }"
											:type="formData.status === 'active' ? 'success' : 'default'"
											@click="formData.status = 'active'"
											size="default"
										>
											<el-icon class="status-icon"><CircleCheckFilled /></el-icon>
											<span class="button-title">正常</span>
										</el-button>

										<el-button
											class="status-button"
											:class="{ 'is-disabled': formData.status === 'disabled' }"
											:type="formData.status === 'disabled' ? 'danger' : 'default'"
											@click="formData.status = 'disabled'"
											size="default"
										>
											<el-icon class="status-icon"><CircleCloseFilled /></el-icon>
											<span class="button-title">禁用</span>
										</el-button>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</div>

					<!-- 组织信息 -->
					<div class="form-group">
						<div class="group-title">
							<el-icon><OfficeBuilding /></el-icon>
							<span>组织信息</span>
						</div>
						<el-row :gutter="20">
							<el-col :xs="24" :sm="12">
								<el-form-item label="所属部门" prop="department">
									<el-select v-model="formData.department" placeholder="请选择部门" style="width: 100%">
										<el-option label="技术部" value="tech">
											<div class="option-item">
												<el-icon><Monitor /></el-icon>
												<span>技术部</span>
											</div>
										</el-option>
										<el-option label="产品部" value="product">
											<div class="option-item">
												<el-icon><Box /></el-icon>
												<span>产品部</span>
											</div>
										</el-option>
										<el-option label="运营部" value="operation">
											<div class="option-item">
												<el-icon><DataAnalysis /></el-icon>
												<span>运营部</span>
											</div>
										</el-option>
										<el-option label="市场部" value="marketing">
											<div class="option-item">
												<el-icon><TrendCharts /></el-icon>
												<span>市场部</span>
											</div>
										</el-option>
										<el-option label="人事部" value="hr">
											<div class="option-item">
												<el-icon><Avatar /></el-icon>
												<span>人事部</span>
											</div>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12">
								<el-form-item label="备注信息" prop="remark">
									<el-input
										v-model="formData.remark"
										type="textarea"
										:rows="3"
										placeholder="请输入备注信息"
										maxlength="200"
										show-word-limit
										resize="none"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
			</div>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose" size="large">
					<el-icon><Close /></el-icon>
					<span>取消</span>
				</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit" size="large">
					<el-icon v-if="!submitLoading">
						<component :is="isEdit ? 'Edit' : 'Plus'" />
					</el-icon>
					<span>{{ isEdit ? '更新用户' : '创建用户' }}</span>
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
	User,
	UserFilled,
	Message,
	Phone,
	Setting,
	Star,
	CircleCheckFilled,
	CircleCloseFilled,
	OfficeBuilding,
	Monitor,
	Box,
	DataAnalysis,
	TrendCharts,
	Avatar,
	Close,
	InfoFilled
} from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	},
	userData: {
		type: Object,
		default: () => ({})
	},
	isEdit: {
		type: Boolean,
		default: false
	}
})

// 定义事件
const emit = defineEmits(['update:visible', 'success'])

// 响应式数据
const dialogVisible = ref(false)
const formRef = ref(null)
const submitLoading = ref(false)

// 表单数据
const formData = reactive({
	id: null,
	username: '',
	name: '',
	email: '',
	phone: '',
	avatar: '',
	role: 'user',
	status: 'active',
	department: '',
	remark: ''
})

// 表单验证规则
const formRules = {
	username: [
		{ required: true, message: '👤 请输入用户名', trigger: 'blur' },
		{ min: 3, max: 20, message: '📏 用户名长度需要在 3-20 个字符之间', trigger: 'blur' },
		{ pattern: /^[a-zA-Z0-9_]+$/, message: '🔤 用户名只能包含字母、数字和下划线', trigger: 'blur' }
	],
	name: [
		{ required: true, message: '👤 请输入真实姓名', trigger: 'blur' },
		{ min: 2, max: 20, message: '📏 姓名长度需要在 2-20 个字符之间', trigger: 'blur' }
	],
	email: [
		{ required: true, message: '📧 请输入邮箱地址', trigger: 'blur' },
		{ type: 'email', message: '📧 请输入正确的邮箱地址格式', trigger: 'blur' }
	],
	phone: [
		{ pattern: /^1[3-9]\d{9}$/, message: '📱 请输入正确的手机号码格式', trigger: 'blur' }
	],
	role: [
		{ required: true, message: '👥 请选择用户角色', trigger: 'change' }
	],
	status: [
		{ required: true, message: '⚡请选择账户状态', trigger: 'change' }
	]
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
	dialogVisible.value = newVal
	if (newVal) {
		initForm()
	}
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
	emit('update:visible', newVal)
})

// 初始化表单
const initForm = () => {
	nextTick(() => {
		if (props.isEdit && props.userData) {
			// 编辑模式，填充数据
			Object.assign(formData, props.userData)
		} else {
			// 新增模式，重置表单
			resetForm()
		}
	})
}

// 重置表单
const resetForm = () => {
	Object.assign(formData, {
		id: null,
		username: '',
		name: '',
		email: '',
		phone: '',
		avatar: '',
		role: 'user',
		status: 'active',
		department: '',
		remark: ''
	})

	if (formRef.value) {
		formRef.value.clearValidate()
	}
}

// 头像上传前验证
const beforeAvatarUpload = (file) => {
	const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
	const isLt2M = file.size / 1024 / 1024 < 2

	if (!isJPG) {
		ElMessage.error({
			message: '🖼️ 头像只能是 JPG/PNG 格式！',
			duration: 3000
		})
		return false
	}
	if (!isLt2M) {
		ElMessage.error({
			message: '📦 头像大小不能超过 2MB！',
			duration: 3000
		})
		return false
	}
	return true
}

// 头像上传成功
const handleAvatarSuccess = (_, file) => {
	formData.avatar = URL.createObjectURL(file.raw)
}

// 头像文件改变
const handleAvatarChange = (file) => {
	if (file.raw) {
		const reader = new FileReader()
		reader.onload = (e) => {
			formData.avatar = e.target.result
		}
		reader.readAsDataURL(file.raw)
	}
}

// 提交表单
const handleSubmit = async () => {
	if (!formRef.value) return

	try {
		await formRef.value.validate()

		submitLoading.value = true

		// 模拟API请求
		await new Promise(resolve => setTimeout(resolve, 1000))

		// 触发成功事件
		emit('success', {
			...formData,
			id: props.isEdit ? formData.id : Date.now(),
			createTime: props.isEdit ? formData.createTime : new Date().toLocaleString()
		})

		ElMessage.success({
			message: props.isEdit ? '✅ 用户信息更新成功！' : '🎉 用户创建成功！',
			duration: 3000
		})
		handleClose()

	} catch (error) {
		console.error('表单验证失败:', error)
	} finally {
		submitLoading.value = false
	}
}

// 关闭对话框
const handleClose = () => {
	dialogVisible.value = false
	resetForm()
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

// 对话框样式
:deep(.user-form-dialog) {
	.el-dialog__header {
		padding: 24px 24px 0;
		border-bottom: 1px solid $border-color-lighter;
		margin-bottom: 0;

		.el-dialog__title {
			font-size: 18px;
			font-weight: 600;
			color: $text-color-primary;
		}
	}

	.el-dialog__body {
		padding: 24px;
	}

	.el-dialog__footer {
		padding: 16px 24px 24px;
		border-top: 1px solid $border-color-lighter;
	}
}

// 主容器
.user-form-container {
	display: flex;
	gap: 24px;
	min-height: 500px;

	@media (max-width: $mobile) {
		flex-direction: column;
		gap: 20px;
	}
}

// 头像区域
.avatar-section {
	flex-shrink: 0;
	width: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;

	@media (max-width: $mobile) {
		width: 100%;
		align-items: center;
	}

	.avatar-upload {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;

		.avatar-container {
			position: relative;
			width: 120px;
			height: 120px;
			border-radius: 12px;
			overflow: hidden;
			border: 2px dashed $border-color-base;
			transition: all 0.3s ease;
			cursor: pointer;

			&:hover {
				border-color: $primary-color;
				box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
			}

			.avatar {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.avatar-placeholder {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background: $bg-color;
				color: $text-color-secondary;
				transition: all 0.3s ease;

				&:hover {
					background: rgba(64, 158, 255, 0.05);
					color: $primary-color;
				}

				.avatar-uploader-icon {
					font-size: 32px;
					margin-bottom: 8px;
				}

				.upload-text {
					font-size: 12px;
					font-weight: 500;
				}
			}
		}

		.avatar-tips {
			display: flex;
			align-items: center;
			gap: 6px;
			padding: 8px 12px;
			background: rgba(64, 158, 255, 0.05);
			border-radius: 6px;
			font-size: 12px;
			color: $text-color-secondary;
			text-align: center;
			line-height: 1.4;

			.tip-icon {
				color: $primary-color;
				font-size: 14px;
			}
		}
	}
}

// 表单区域
.form-section {
	flex: 1;
	min-width: 0;

	.user-form {
		.form-group {
			margin-bottom: 32px;

			&:last-child {
				margin-bottom: 0;
			}

			.group-title {
				display: flex;
				align-items: center;
				gap: 8px;
				margin-bottom: 20px;
				padding-bottom: 12px;
				border-bottom: 2px solid $border-color-lighter;
				font-size: 16px;
				font-weight: 600;
				color: $text-color-primary;

				.el-icon {
					color: $primary-color;
					font-size: 18px;
				}
			}
		}

		:deep(.el-form-item) {
			margin-bottom: 20px;

			.el-form-item__label {
				font-weight: 500;
				color: $text-color-regular;
				margin-bottom: 8px;
				line-height: 1.4;
			}

			.el-form-item__content {
				line-height: 1.4;
			}
		}

		:deep(.el-input) {
			.el-input__wrapper {
				border-radius: 8px;
				box-shadow: 0 0 0 1px $border-color-base;
				transition: all 0.3s ease;

				&:hover {
					box-shadow: 0 0 0 1px $primary-color;
				}

				&.is-focus {
					box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
				}
			}
		}

		:deep(.el-select) {
			.el-select__wrapper {
				height: 40px;
				border-radius: 8px;
				box-shadow: 0 0 0 1px $border-color-base;
				transition: all 0.3s ease;

				&:hover {
					box-shadow: 0 0 0 1px $primary-color;
				}

				&.is-focus {
					box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
				}
			}
		}

		:deep(.el-textarea) {
			.el-textarea__inner {
				border-radius: 8px;
				border: 1px solid $border-color-base;
				transition: all 0.3s ease;

				&:hover {
					border-color: $primary-color;
				}

				&:focus {
					border-color: $primary-color;
					box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
				}
			}
		}

		.status-button-group {
			display: flex;
			flex-direction: row;
			gap: 12px;

			.status-button {
				flex: 1;
				height: 40px;
				min-height: 40px;
				padding: 8px 12px !important;
				border-radius: 8px !important;
				border: 2px solid $border-color-base !important;
				background: white !important;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
				position: relative;
				overflow: hidden;
				display: flex !important;
				align-items: center !important;
				justify-content: center !important;
				gap: 6px !important;

				&:hover {
					transform: translateY(-1px) !important;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
				}

				&:focus {
					outline: none !important;
					box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
				}

				.status-icon {
					font-size: 16px;
					transition: all 0.3s ease;
					flex-shrink: 0;
				}

				.button-title {
					font-size: 13px;
					font-weight: 600;
					transition: color 0.3s ease;
					white-space: nowrap;
				}

				// 正常状态按钮样式
				&.is-active {
					background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%) !important;
					border-color: #28a745 !important;
					color: #28a745 !important;

					&:hover {
						background: linear-gradient(135deg, rgba(40, 167, 69, 0.15) 0%, rgba(32, 201, 151, 0.15) 100%) !important;
						border-color: #20c997 !important;
						transform: translateY(-2px) !important;
						box-shadow: 0 6px 20px rgba(40, 167, 69, 0.2) !important;
					}

					&:focus {
						background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%) !important;
						border-color: #28a745 !important;
						box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2) !important;
					}

					.status-icon {
						color: #28a745 !important;
						animation: iconPulse 0.6s ease-out;
					}

					.button-title {
						color: #28a745 !important;
						font-weight: 700;
					}
				}

				// 禁用状态按钮样式
				&.is-disabled {
					background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(231, 76, 60, 0.1) 100%) !important;
					border-color: #dc3545 !important;
					color: #dc3545 !important;

					&:hover {
						background: linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(231, 76, 60, 0.15) 100%) !important;
						border-color: #e74c3c !important;
						transform: translateY(-2px) !important;
						box-shadow: 0 6px 20px rgba(220, 53, 69, 0.2) !important;
					}

					&:focus {
						background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(231, 76, 60, 0.1) 100%) !important;
						border-color: #dc3545 !important;
						box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
					}

					.status-icon {
						color: #dc3545 !important;
						animation: iconPulse 0.6s ease-out;
					}

					.button-title {
						color: #dc3545 !important;
						font-weight: 700;
					}
				}

			}
		}

		// 图标脉冲动画
		@keyframes iconPulse {
			0% {
				transform: scale(1);
			}
			50% {
				transform: scale(1.1);
			}
			100% {
				transform: scale(1);
			}
		}


	}
}

// 选项样式
:deep(.el-select-dropdown) {
	.option-item {
		display: flex;
		align-items: center;
		gap: 12px;

		.el-icon {
			color: $primary-color;
			width: 16px;
			height: 16px;
			font-size: 16px;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		span {
			line-height: 1.2;
			transform: translateY(-1px);
			display: inline-block;
		}
	}
}

// 头像上传器样式
:deep(.avatar-uploader .el-upload) {
	width: 100%;
	height: 100%;
	border: none;
	border-radius: 12px;
	overflow: hidden;
}

// 底部按钮
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;

	.el-button {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.3s ease;

		&:not(.is-loading):hover {
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		.el-icon {
			font-size: 16px;
		}
	}
}

// 中等屏幕响应式设计
@media (max-width: 768px) {
	.user-form-container {
		.form-section {
			.user-form {
				:deep(.el-select) {
					.el-select__wrapper {
						height: 36px;
					}
				}

				.status-button-group {
					gap: 8px;

					.status-button {
						height: 36px;
						min-height: 36px;
						padding: 8px 12px;

						.status-icon {
							font-size: 14px;
						}

						.button-title {
							font-size: 12px;
						}
					}
				}
			}
		}
	}
}

// 小屏幕响应式设计
@media (max-width: $mobile) {
	.user-form-container {
		.form-section {
			.user-form {
				.form-group {
					margin-bottom: 24px;

					.group-title {
						font-size: 14px;
						margin-bottom: 16px;
					}
				}

				:deep(.el-form-item) {
					margin-bottom: 16px;
				}

				:deep(.el-select) {
					.el-select__wrapper {
						height: 36px;
					}
				}

				.status-button-group {
					flex-direction: column;
					gap: 8px;

					.status-button {
						flex: none;
						height: 36px;
						min-height: 36px;
						padding: 8px 12px;

						.status-icon {
							font-size: 14px;
						}

						.button-title {
							font-size: 12px;
						}
					}
				}
			}
		}
	}

	.dialog-footer {
		flex-direction: column-reverse;

		.el-button {
			width: 100%;
			justify-content: center;
		}
	}
}
</style>
