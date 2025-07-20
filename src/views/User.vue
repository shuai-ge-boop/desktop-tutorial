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
                    <el-button type="danger" :icon="Delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">
                        批量删除
                    </el-button>
                    <el-dropdown @command="handleImportExport">
                        <el-button type="success" :icon="Upload">
                            导入导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="import">
                                    <el-icon><Upload /></el-icon>
                                    批量导入
                                </el-dropdown-item>
                                <el-dropdown-item command="template">
                                    <el-icon><Download /></el-icon>
                                    下载模板
                                </el-dropdown-item>
                                <el-dropdown-item divided command="export-excel">
                                    <el-icon><Document /></el-icon>
                                    导出Excel
                                </el-dropdown-item>
                                <el-dropdown-item command="export-csv">
                                    <el-icon><Document /></el-icon>
                                    导出CSV
                                </el-dropdown-item>
                                <el-dropdown-item command="export-pdf">
                                    <el-icon><Document /></el-icon>
                                    导出PDF
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>

                <div class="operation-right">
                    <div class="filter-controls">
                        <el-select v-model="filterRole" placeholder="角色筛选" clearable style="width: 120px; margin-right: 10px" @change="handleSearch">
                            <el-option label="管理员" value="admin" />
                            <el-option label="版主" value="moderator" />
                            <el-option label="普通用户" value="user" />
                        </el-select>
                        <el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 120px; margin-right: 10px" @change="handleSearch">
                            <el-option label="正常" value="active" />
                            <el-option label="禁用" value="disabled" />
                        </el-select>
                        <el-input v-model="searchKeyword" placeholder="请输入用户名或邮箱" :prefix-icon="Search"
                            @input="handleSearch" clearable style="width: 300px" />
                    </div>
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
                        <el-switch
                            v-model="row.status"
                            active-value="active"
                            inactive-value="disabled"
                            active-text="正常"
                            inactive-text="禁用"
                            @change="handleStatusChange(row)"
                        />
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" />

                <el-table-column label="操作" width="250">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="info" size="small" :icon="View" @click="handleView(row)">
                            查看
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



        <!-- 用户表单对话框 -->
        <UserForm
            v-model:visible="userFormVisible"
            :user-data="currentUser"
            :is-edit="isEditMode"
            @success="handleUserFormSuccess"
        />

        <!-- 用户导入对话框 -->
        <UserImport
            v-model:visible="importVisible"
            @success="handleImportSuccess"
        />

        <!-- 用户详情对话框 -->
        <el-dialog
            v-model="userDetailVisible"
            title="用户详情"
            width="600px"
        >
            <div v-if="currentUser" class="user-detail">
                <div class="detail-header">
                    <el-avatar :src="currentUser.avatar" :size="80" />
                    <div class="user-info">
                        <h3>{{ currentUser.name }}</h3>
                        <p>@{{ currentUser.username }}</p>
                        <el-tag :type="getRoleType(currentUser.role)">
                            {{ getRoleText(currentUser.role) }}
                        </el-tag>
                    </div>
                </div>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
                    <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
                    <el-descriptions-item label="手机号">{{ currentUser.phone || '未设置' }}</el-descriptions-item>
                    <el-descriptions-item label="部门">{{ getDepartmentText(currentUser.department) || '未设置' }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="currentUser.status === 'active' ? 'success' : 'danger'">
                            {{ currentUser.status === 'active' ? '正常' : '禁用' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ currentUser.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="备注" :span="2">{{ currentUser.remark || '无' }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Plus,
    Delete,
    Search,
    Edit,
    Upload,
    Download,
    Document,
    View,
    ArrowDown
} from '@element-plus/icons-vue'
import UserForm from '@/components/UserForm.vue'
import UserImport from '@/components/UserImport.vue'
import { useUserDataStore } from '@/stores/userData'
import {
    exportToExcel,
    exportToCSV,
    exportToPDF,
    generateImportTemplate
} from '@/utils/exportUtils'

// 表格数据
const tableData = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedRows = ref([])

// 筛选条件
const filterRole = ref('')
const filterStatus = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框状态
const userFormVisible = ref(false)
const importVisible = ref(false)
const userDetailVisible = ref(false)
const currentUser = ref(null)
const isEditMode = ref(false)

// 使用共享的用户数据状态管理
const userDataStore = useUserDataStore()
// 使用storeToRefs保持响应性
const { users: mockUsers } = storeToRefs(userDataStore)
// 方法可以直接解构
const { addUser, updateUser, deleteUser, deleteUsers } = userDataStore



// 获取用户列表
const fetchUsers = async () => {
    loading.value = true

    try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))

        // 确保用户数据存在
        if (!mockUsers.value || !Array.isArray(mockUsers.value)) {
            console.error('用户数据未正确初始化:', mockUsers.value)
            ElMessage.error('用户数据加载失败')
            return
        }

        // 模拟搜索和筛选
        let filteredData = mockUsers.value

        // 关键词搜索
        if (searchKeyword.value) {
            filteredData = filteredData.filter(user =>
                user.username.includes(searchKeyword.value) ||
                user.name.includes(searchKeyword.value) ||
                user.email.includes(searchKeyword.value)
            )
        }

        // 角色筛选
        if (filterRole.value) {
            filteredData = filteredData.filter(user => user.role === filterRole.value)
        }

        // 状态筛选
        if (filterStatus.value) {
            filteredData = filteredData.filter(user => user.status === filterStatus.value)
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
    currentUser.value = null
    isEditMode.value = false
    userFormVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
    currentUser.value = { ...row }
    isEditMode.value = true
    userFormVisible.value = true
}

// 查看用户详情
const handleView = (row) => {
    currentUser.value = { ...row }
    userDetailVisible.value = true
}

// 状态切换
const handleStatusChange = async (row) => {
    try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300))

        // 使用共享状态管理更新用户状态
        const userIndex = mockUsers.value.findIndex(user => user.id === row.id)
        if (userIndex !== -1) {
            const updatedUser = { ...mockUsers.value[userIndex], status: row.status }
            updateUser(updatedUser)
        }

        ElMessage.success(`用户状态已${row.status === 'active' ? '启用' : '禁用'}`)
    } catch (error) {
        // 恢复原状态
        row.status = row.status === 'active' ? 'disabled' : 'active'
        ElMessage.error('状态更新失败')
    }
}

// 删除用户
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 ${row.name} 吗？此操作不可恢复！`,
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300))

        // 使用共享状态管理删除用户
        deleteUser(row.id)

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
            `确定要删除选中的 ${selectedRows.value.length} 个用户吗？此操作不可恢复！`,
            '批量删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))

        // 使用共享状态管理批量删除用户
        const selectedIds = selectedRows.value.map(row => row.id)
        deleteUsers(selectedIds)

        ElMessage.success(`成功删除 ${selectedRows.value.length} 个用户`)
        selectedRows.value = []
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

// 导入导出处理
const handleImportExport = (command) => {
    switch (command) {
        case 'import':
            importVisible.value = true
            break
        case 'template':
            const result = generateImportTemplate()
            if (result.success) {
                ElMessage.success(result.message)
            } else {
                ElMessage.error(result.message)
            }
            break
        case 'export-excel':
            handleExport('excel')
            break
        case 'export-csv':
            handleExport('csv')
            break
        case 'export-pdf':
            handleExport('pdf')
            break
    }
}

// 导出处理
const handleExport = async (format) => {
    try {
        // 获取当前筛选的数据
        let exportData = mockUsers.value

        // 应用筛选条件
        if (searchKeyword.value) {
            exportData = exportData.filter(user =>
                user.username.includes(searchKeyword.value) ||
                user.name.includes(searchKeyword.value) ||
                user.email.includes(searchKeyword.value)
            )
        }

        if (filterRole.value) {
            exportData = exportData.filter(user => user.role === filterRole.value)
        }

        if (filterStatus.value) {
            exportData = exportData.filter(user => user.status === filterStatus.value)
        }

        let result
        const filename = `用户数据_${new Date().toLocaleDateString()}`

        switch (format) {
            case 'csv':
                result = exportToCSV(exportData, filename)
                break
            case 'pdf':
                result = exportToPDF(exportData, filename)
                break
            default:
                result = exportToExcel(exportData, filename)
        }

        if (result.success) {
            ElMessage.success(result.message)
        } else {
            ElMessage.error(result.message)
        }
    } catch (error) {
        ElMessage.error('导出失败')
    }
}

// 用户表单成功处理
const handleUserFormSuccess = (userData) => {
    if (isEditMode.value) {
        // 编辑模式：使用共享状态管理更新用户
        updateUser(userData)
        ElMessage.success('用户信息更新成功')
    } else {
        // 新增模式：使用共享状态管理添加用户
        addUser(userData)
        ElMessage.success('用户创建成功')
    }

    fetchUsers()
}

// 导入成功处理
const handleImportSuccess = () => {
    ElMessage.success('用户导入成功')
    fetchUsers()
}

// 获取部门文本
const getDepartmentText = (department) => {
    const departmentMap = {
        tech: '技术部',
        product: '产品部',
        operation: '运营部',
        marketing: '市场部',
        hr: '人事部'
    }
    return departmentMap[department] || ''
}

// 组件挂载时获取数据
onMounted(() => {
    fetchUsers()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

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
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .operation-right {
                .filter-controls {
                    display: flex;
                    align-items: center;
                }
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



    .user-detail {
        .detail-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ebeef5;

            .user-info {
                margin-left: 20px;

                h3 {
                    margin-bottom: 5px;
                    color: $text-color-primary;
                }

                p {
                    margin-bottom: 10px;
                    color: $text-color-secondary;
                    font-size: 14px;
                }
            }
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

                    .filter-controls {
                        flex-direction: column;
                        gap: 10px;
                        width: 100%;

                        .el-select,
                        .el-input {
                            width: 100% !important;
                        }
                    }
                }
            }
        }


    }
}
</style>