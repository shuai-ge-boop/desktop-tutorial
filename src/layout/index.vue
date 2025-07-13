<template>
    <div class="layout-container">
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px" class="layout-aside">
                <div class="logo-container">
                    <h3>管理系统</h3>
                </div>

                <el-menu :default-active="$route.path" class="layout-menu" router :collapse="false">
                    <el-menu-item index="/dashboard">
                        <el-icon>
                            <House />
                        </el-icon>
                        <template #title>首页</template>
                    </el-menu-item>

                    <el-menu-item index="/user">
                        <el-icon>
                            <User />
                        </el-icon>
                        <template #title>用户管理</template>
                    </el-menu-item>

                    <el-menu-item index="/system">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <template #title>系统管理</template>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主内容区域 -->
            <el-container>
                <!-- 顶部导航 -->
                <el-header height="60px" class="layout-header">
                    <div class="header-content">
                        <div class="header-left">
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item v-if="$route.meta.title">
                                    {{ $route.meta.title }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>

                        <div class="header-right">
                            <el-dropdown @command="handleCommand">
                                <div class="user-info">
                                    <el-avatar :src="userInfo.avatar" :size="32" class="user-avatar" />
                                    <span class="username">{{ userInfo.name }}</span>
                                    <el-icon class="arrow-down">
                                        <ArrowDown />
                                    </el-icon>
                                </div>

                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="profile">
                                            <el-icon>
                                                <User />
                                            </el-icon>
                                            个人中心
                                        </el-dropdown-item>
                                        <el-dropdown-item command="settings">
                                            <el-icon>
                                                <Setting />
                                            </el-icon>
                                            设置
                                        </el-dropdown-item>
                                        <el-dropdown-item divided command="logout">
                                            <el-icon>
                                                <SwitchButton />
                                            </el-icon>
                                            退出登录
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </el-header>

                <!-- 主内容 -->
                <el-main class="layout-main">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
    House,
    User,
    Setting,
    ArrowDown,
    SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.getUserInfo())

// 下拉菜单处理
const handleCommand = async (command) => {
    switch (command) {
        case 'profile':
            ElMessage.info('个人中心功能开发中...')
            break
        case 'settings':
            ElMessage.info('设置功能开发中...')
            break
        case 'logout':
            await handleLogout()
            break
    }
}

// 退出登录
const handleLogout = async () => {
    try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
    } catch (error) {
        // 用户取消操作
    }
}
</script>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .layout-aside {
        .logo-container {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid $border-color-base;

            h3 {
                color: $text-color-primary;
                font-size: 18px;
                font-weight: 600;
            }
        }

        .layout-menu {
            border-right: none;

            .el-menu-item {
                height: 50px;
                line-height: 50px;

                &.is-active {
                    color: $primary-color;
                    background-color: rgba(64, 158, 255, 0.1);
                }

                &:hover {
                    background-color: rgba(64, 158, 255, 0.05);
                }
            }
        }
    }

    .layout-header {
        .header-content {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;

            .header-left {
                .el-breadcrumb {
                    font-size: 14px;
                }
            }

            .header-right {
                .user-info {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 4px;
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }

                    .user-avatar {
                        margin-right: 8px;
                    }

                    .username {
                        margin-right: 5px;
                        color: $text-color-primary;
                        font-size: 14px;
                    }

                    .arrow-down {
                        color: $text-color-secondary;
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .layout-main {
        background-color: $bg-color;
        padding: 20px;
    }
}
</style>