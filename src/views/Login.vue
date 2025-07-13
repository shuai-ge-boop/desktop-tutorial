<template>
    <div class="login-container">
        <div class="login-form">
            <h2 class="login-title">后台管理系统</h2>

            <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" @keyup.enter="handleLogin">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large"
                        clearable />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
                        size="large" clearable show-password />
                </el-form-item>

                <el-form-item>
                    <el-checkbox v-model="loginForm.remember">
                        记住我
                    </el-checkbox>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="login-btn" size="large" :loading="loading" @click="handleLogin">
                        {{ loading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="login-tips">
                <p>提示：用户名和密码任意输入即可</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const loginForm = reactive({
    username: '',
    password: '',
    remember: false
})

// 表单验证规则
const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ]
}

// 表单引用
const loginFormRef = ref(null)
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
    // 表单验证
    if (!loginFormRef.value) return

    const valid = await loginFormRef.value.validate().catch(() => false)
    if (!valid) return

    loading.value = true

    try {
        // 调用登录接口
        const result = await userStore.login(loginForm)

        if (result.success) {
            ElMessage.success(result.message)
            // 跳转到首页
            router.push('/')
        } else {
            ElMessage.error(result.message)
        }
    } catch (error) {
        ElMessage.error('登录失败，请重试')
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.login-tips {
    text-align: center;
    margin-top: 20px;
    color: $text-color-secondary;
    font-size: 12px;
}
</style>