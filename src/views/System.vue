<template>
    <div class="system-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h1>系统管理</h1>
            <p>管理系统配置和设置</p>
        </div>

        <!-- 系统设置卡片 -->
        <el-row :gutter="20">
            <el-col :xs="24" :lg="12">
                <el-card class="setting-card">
                    <template #header>
                        <div class="card-header">
                            <h3>基础设置</h3>
                        </div>
                    </template>

                    <el-form :model="basicSettings" label-width="120px">
                        <el-form-item label="系统名称">
                            <el-input v-model="basicSettings.systemName" />
                        </el-form-item>

                        <el-form-item label="系统描述">
                            <el-input v-model="basicSettings.systemDescription" type="textarea" :rows="3" />
                        </el-form-item>

                        <el-form-item label="系统版本">
                            <el-input v-model="basicSettings.version" readonly />
                        </el-form-item>

                        <el-form-item label="维护模式">
                            <el-switch v-model="basicSettings.maintenanceMode" active-text="开启" inactive-text="关闭" />
                        </el-form-item>

                        <el-form-item label="用户注册">
                            <el-switch v-model="basicSettings.allowRegistration" active-text="允许" inactive-text="禁止" />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="handleSaveBasic">
                                保存基础设置
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>

            <el-col :xs="24" :lg="12">
                <el-card class="setting-card">
                    <template #header>
                        <div class="card-header">
                            <h3>安全设置</h3>
                        </div>
                    </template>

                    <el-form :model="securitySettings" label-width="120px">
                        <el-form-item label="登录超时">
                            <el-input-number v-model="securitySettings.loginTimeout" :min="1" :max="1440" />
                            <span class="unit">分钟</span>
                        </el-form-item>

                        <el-form-item label="密码强度">
                            <el-select v-model="securitySettings.passwordStrength" style="width: 100%">
                                <el-option label="低" value="low" />
                                <el-option label="中" value="medium" />
                                <el-option label="高" value="high" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="二步验证">
                            <el-switch v-model="securitySettings.twoFactorAuth" active-text="开启" inactive-text="关闭" />
                        </el-form-item>

                        <el-form-item label="登录日志">
                            <el-switch v-model="securitySettings.loginLogging" active-text="开启" inactive-text="关闭" />
                        </el-form-item>

                        <el-form-item label="IP白名单">
                            <el-switch v-model="securitySettings.ipWhitelist" active-text="开启" inactive-text="关闭" />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="handleSaveSecurity">
                                保存安全设置
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>

        <!-- 系统信息 -->
        <el-card class="info-card">
            <template #header>
                <div class="card-header">
                    <h3>系统信息</h3>
                    <el-button type="primary" size="small" @click="handleRefreshInfo">
                        刷新信息
                    </el-button>
                </div>
            </template>

            <el-descriptions :column="2" border>
                <el-descriptions-item label="操作系统">
                    {{ systemInfo.os }}
                </el-descriptions-item>

                <el-descriptions-item label="服务器时间">
                    {{ systemInfo.serverTime }}
                </el-descriptions-item>

                <el-descriptions-item label="运行时间">
                    {{ systemInfo.uptime }}
                </el-descriptions-item>

                <el-descriptions-item label="数据库版本">
                    {{ systemInfo.databaseVersion }}
                </el-descriptions-item>

                <el-descriptions-item label="PHP版本">
                    {{ systemInfo.phpVersion }}
                </el-descriptions-item>

                <el-descriptions-item label="内存使用">
                    {{ systemInfo.memoryUsage }}
                </el-descriptions-item>

                <el-descriptions-item label="磁盘使用">
                    {{ systemInfo.diskUsage }}
                </el-descriptions-item>

                <el-descriptions-item label="在线用户">
                    {{ systemInfo.onlineUsers }}
                </el-descriptions-item>
            </el-descriptions>
        </el-card>

        <!-- 系统操作 -->
        <el-card class="operation-card">
            <template #header>
                <div class="card-header">
                    <h3>系统操作</h3>
                </div>
            </template>

            <div class="operation-grid">
                <el-button v-for="operation in systemOperations" :key="operation.name" :type="operation.type"
                    :icon="operation.icon" @click="handleOperation(operation.action)" size="large">
                    {{ operation.name }}
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Refresh,
    Download,
    Upload,
    DeleteFilled,
    Tools,
    Warning
} from '@element-plus/icons-vue'

// 基础设置
const basicSettings = ref({
    systemName: 'Vue3后台管理系统',
    systemDescription: '基于Vue3 + ElementPlus + SCSS的现代化后台管理系统',
    version: '1.0.0',
    maintenanceMode: false,
    allowRegistration: true
})

// 安全设置
const securitySettings = ref({
    loginTimeout: 30,
    passwordStrength: 'medium',
    twoFactorAuth: false,
    loginLogging: true,
    ipWhitelist: false
})

// 系统信息
const systemInfo = ref({
    os: 'Windows 10',
    serverTime: '2024-01-01 10:00:00',
    uptime: '7天 12小时 30分钟',
    databaseVersion: 'MySQL 8.0',
    phpVersion: 'PHP 8.2',
    memoryUsage: '512MB / 2GB',
    diskUsage: '50GB / 100GB',
    onlineUsers: 23
})

// 系统操作
const systemOperations = ref([
    {
        name: '清理缓存',
        type: 'primary',
        icon: Refresh,
        action: 'clear-cache'
    },
    {
        name: '数据备份',
        type: 'success',
        icon: Download,
        action: 'backup'
    },
    {
        name: '数据恢复',
        type: 'warning',
        icon: Upload,
        action: 'restore'
    },
    {
        name: '清理日志',
        type: 'info',
        icon: DeleteFilled,
        action: 'clear-logs'
    },
    {
        name: '系统优化',
        type: 'primary',
        icon: Tools,
        action: 'optimize'
    },
    {
        name: '重启系统',
        type: 'danger',
        icon: Warning,
        action: 'restart'
    }
])

// 保存基础设置
const handleSaveBasic = () => {
    ElMessage.success('基础设置保存成功')
}

// 保存安全设置
const handleSaveSecurity = () => {
    ElMessage.success('安全设置保存成功')
}

// 刷新系统信息
const handleRefreshInfo = () => {
    systemInfo.value.serverTime = new Date().toLocaleString()
    systemInfo.value.onlineUsers = Math.floor(Math.random() * 100) + 1
    ElMessage.success('系统信息刷新成功')
}

// 处理系统操作
const handleOperation = async (action) => {
    switch (action) {
        case 'clear-cache':
            ElMessage.success('缓存清理成功')
            break
        case 'backup':
            ElMessage.info('数据备份已开始，请稍候...')
            break
        case 'restore':
            ElMessage.info('数据恢复功能开发中...')
            break
        case 'clear-logs':
            ElMessage.success('日志清理成功')
            break
        case 'optimize':
            ElMessage.success('系统优化完成')
            break
        case 'restart':
            try {
                await ElMessageBox.confirm(
                    '确定要重启系统吗？重启后需要重新登录。',
                    '系统重启确认',
                    {
                        confirmButtonText: '确定重启',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                ElMessage.warning('系统重启功能在演示环境中不可用')
            } catch (error) {
                // 用户取消操作
            }
            break
    }
}

// 组件挂载时初始化
onMounted(() => {
    handleRefreshInfo()
})
</script>

<style lang="scss" scoped>
.system-container {
    .page-header {
        margin-bottom: 20px;

        h1 {
            font-size: 24px;
            color: $text-color-primary;
            margin-bottom: 8px;
        }

        p {
            color: $text-color-secondary;
            font-size: 14px;
        }
    }

    .setting-card {
        margin-bottom: 20px;
        height: 460px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h3 {
                margin: 0;
                color: $text-color-primary;
            }
        }

        .unit {
            margin-left: 10px;
            color: $text-color-secondary;
            font-size: 12px;
        }
    }

    .info-card {
        margin-bottom: 20px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h3 {
                margin: 0;
                color: $text-color-primary;
            }
        }
    }

    .operation-card {
        .card-header {
            h3 {
                margin: 0;
                color: $text-color-primary;
            }
        }

        .operation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;

            .el-button {
                height: 50px;
            }
        }
    }
}

// 响应式样式
@media (max-width: $mobile) {
    .system-container {
        .setting-card {
            height: auto;
            margin-bottom: 15px;
        }

        .operation-card {
            .operation-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }
}
</style>