<template>
	<el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="600px" :before-close="handleClose"
		destroy-on-close>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
			<!-- 头像上传 -->
			<el-form-item label="头像" prop="avatar">
				<div class="avatar-upload">
					<el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload"
						:on-success="handleAvatarSuccess" action="#" :auto-upload="false"
						:on-change="handleAvatarChange">
						<img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
						<el-icon v-else class="avatar-uploader-icon">
							<Plus />
						</el-icon>
					</el-upload>
					<div class="avatar-tips">
						<p>支持 jpg、png 格式，文件大小不超过 2MB</p>
					</div>
				</div>
			</el-form-item>

			<!-- 用户名 -->
			<el-form-item label="用户名" prop="username">
				<el-input v-model="formData.username" placeholder="请输入用户名" :disabled="isEdit" maxlength="20"
					show-word-limit />
			</el-form-item>

			<!-- 姓名 -->
			<el-form-item label="姓名" prop="name">
				<el-input v-model="formData.name" placeholder="请输入真实姓名" maxlength="20" show-word-limit />
			</el-form-item>

			<!-- 邮箱 -->
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="formData.email" placeholder="请输入邮箱地址" type="email" />
			</el-form-item>

			<!-- 手机号 -->
			<el-form-item label="手机号" prop="phone">
				<el-input v-model="formData.phone" placeholder="请输入手机号码" maxlength="11" />
			</el-form-item>

			<!-- 角色 -->
			<el-form-item label="角色" prop="role">
				<el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
					<el-option label="管理员" value="admin" />
					<el-option label="版主" value="moderator" />
					<el-option label="普通用户" value="user" />
				</el-select>
			</el-form-item>

			<!-- 状态 -->
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="formData.status">
					<el-radio value="active">正常</el-radio>
					<el-radio value="disabled">禁用</el-radio>
				</el-radio-group>
			</el-form-item>

			<!-- 部门 -->
			<el-form-item label="部门" prop="department">
				<el-select v-model="formData.department" placeholder="请选择部门" style="width: 100%">
					<el-option label="技术部" value="tech" />
					<el-option label="产品部" value="product" />
					<el-option label="运营部" value="operation" />
					<el-option label="市场部" value="marketing" />
					<el-option label="人事部" value="hr" />
				</el-select>
			</el-form-item>

			<!-- 备注 -->
			<el-form-item label="备注" prop="remark">
				<el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" maxlength="200"
					show-word-limit />
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">
					{{ isEdit ? '更新' : '创建' }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

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
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
		{ pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
	],
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' },
		{ min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
	],
	email: [
		{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
		{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
	],
	phone: [
		{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
	],
	role: [
		{ required: true, message: '请选择角色', trigger: 'change' }
	],
	status: [
		{ required: true, message: '请选择状态', trigger: 'change' }
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
		ElMessage.error('头像只能是 JPG/PNG 格式!')
		return false
	}
	if (!isLt2M) {
		ElMessage.error('头像大小不能超过 2MB!')
		return false
	}
	return true
}

// 头像上传成功
const handleAvatarSuccess = (response, file) => {
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

		ElMessage.success(props.isEdit ? '更新成功' : '创建成功')
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
.avatar-upload {
	display: flex;
	align-items: flex-start;
	gap: 15px;

	.avatar-uploader {
		.avatar {
			width: 80px;
			height: 80px;
			border-radius: 6px;
			object-fit: cover;
		}
	}

	.avatar-tips {
		p {
			margin: 0;
			font-size: 12px;
			color: #999;
			line-height: 1.4;
		}
	}
}

:deep(.avatar-uploader .el-upload) {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: 0.2s;
	width: 80px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		border-color: #409eff;
	}
}

:deep(.avatar-uploader-icon) {
	font-size: 28px;
	color: #8c939d;
}

.dialog-footer {
	text-align: right;
}
</style>
