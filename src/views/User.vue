<template>
    <div class="user-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h1>用户管理</h1>
            <p>管理系统用户信息</p>
        </div>

        <!-- 操作栏 -->
        <el-card class="operation-card">
            <div class="operation-bar">
                <div class="operation-left">
                    <el-button type="primary" :icon="Plus" @click="handleAdd">
                        新增用户
                    </el-button>
                    <el-button type="danger" :icon="Delete" @click="handleBatchDelete">
                        批量删除
                    </el-button>
                </div>

                <div class="operation-right">
                    <el-input v-model="searchKeyword" placeholder="请输入用户名或邮箱" :prefix-icon="Search"
                        @input="handleSearch" clearable style="width: 300px" />
                </div>
            </div>
        </el-card>

        <!-- 用户表格 -->
        <el-card class="table-card">
            <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column type="selection" width="55" />

                <el-table-column prop="id" label="ID" width="80" />

                <el-table-column prop="avatar" label="头像" width="80">
                    <template #default="{ row }">
                        <el-avatar :src="row.avatar" :size="40" />
                    </template>
                </el-table-column>

                <el-table-column prop="username" label="用户名" />

                <el-table-column prop="name" label="姓名" />

                <el-table-column prop="email" label="邮箱" />

                <el-table-column prop="role" label="角色">
                    <template #default="{ row }">
                        <el-tag :type="getRoleType(row.role)">
                            {{ getRoleText(row.role) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                            {{ row.status === 'active' ? '正常' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" />

                <el-table-column label="操作" width="200">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Plus,
    Delete,
    Search,
    Edit
} from '@element-plus/icons-vue'

// 表格数据
const tableData = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedRows = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟用户数据
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'admin',
        status: 'active',
        createTime: '2023-01-01 10:00:00'
    },
    {
        id: 2,
        username: 'user1',
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
        role: 'user',
        status: 'active',
        createTime: '2023-01-02 14:30:00'
    },
    {
        id: 3,
        username: 'user2',
        name: '李四',
        email: 'lisi@example.com',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        role: 'user',
        status: 'disabled',
        createTime: '2023-01-03 09:15:00'
    },
    {
        id: 4,
        username: 'moderator',
        name: '王五',
        email: 'wangwu@example.com',
        avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png',
        role: 'moderator',
        status: 'active',
        createTime: '2023-01-04 16:45:00'
    }
]

// 获取用户列表
const fetchUsers = async () => {
    loading.value = true

    try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))

        // 模拟搜索过滤
        let filteredData = mockUsers
        if (searchKeyword.value) {
            filteredData = mockUsers.filter(user =>
                user.username.includes(searchKeyword.value) ||
                user.name.includes(searchKeyword.value) ||
                user.email.includes(searchKeyword.value)
            )
        }

        // 模拟分页
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value

        tableData.value = filteredData.slice(start, end)
        total.value = filteredData.length

    } catch (error) {
        ElMessage.error('获取用户列表失败')
    } finally {
        loading.value = false
    }
}

// 获取角色类型
const getRoleType = (role) => {
    const types = {
        admin: 'danger',
        moderator: 'warning',
        user: 'info'
    }
    return types[role] || 'info'
}

// 获取角色文本
const getRoleText = (role) => {
    const texts = {
        admin: '管理员',
        moderator: '版主',
        user: '普通用户'
    }
    return texts[role] || '未知'
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    fetchUsers()
}

// 选择改变
const handleSelectionChange = (selection) => {
    selectedRows.value = selection
}

// 新增用户
const handleAdd = () => {
    ElMessage.info('新增用户功能开发中...')
}

// 编辑用户
const handleEdit = (row) => {
    ElMessage.info(`编辑用户 ${row.name} 功能开发中...`)
}

// 删除用户
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 ${row.name} 吗？`,
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        ElMessage.success('删除成功')
        fetchUsers()
    } catch (error) {
        // 用户取消操作
    }
}

// 批量删除
const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先选择要删除的用户')
        return
    }

    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
            '批量删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        ElMessage.success('批量删除成功')
        fetchUsers()
    } catch (error) {
        // 用户取消操作
    }
}

// 分页大小改变
const handleSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
    fetchUsers()
}

// 当前页改变
const handleCurrentChange = (page) => {
    currentPage.value = page
    fetchUsers()
}

// 组件挂载时获取数据
onMounted(() => {
    fetchUsers()
})
</script>

<style lang="scss" scoped>
.user-container {
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

    .operation-card {
        margin-bottom: 20px;

        .operation-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .operation-left {
                .el-button {
                    margin-right: 10px;
                }
            }

            .operation-right {
                display: flex;
                align-items: center;
            }
        }
    }

    .table-card {
        .pagination-container {
            margin-top: 20px;
            display: flex;
            justify-content: center;
        }
    }
}

// 响应式样式
@media (max-width: $mobile) {
    .user-container {
        .operation-card {
            .operation-bar {
                flex-direction: column;
                gap: 15px;

                .operation-left,
                .operation-right {
                    width: 100%;
                    justify-content: center;
                }
            }
        }
    }
}
</style>