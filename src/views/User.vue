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

        <!-- 统计图表 -->
        <el-row :gutter="20" class="charts-row">
            <el-col :span="12">
                <el-card class="chart-card" shadow="hover">
                    <template #header>
                        <span>👥 用户角色分布</span>
                    </template>
                    <EChartsComponent
                        :option="roleChartOption"
                        height="300px"
                    />
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="chart-card" shadow="hover">
                    <template #header>
                        <span>📊 用户状态统计</span>
                    </template>
                    <EChartsComponent
                        :option="statusChartOption"
                        height="300px"
                    />
                </el-card>
            </el-col>
        </el-row>

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
import { ref, onMounted, computed } from 'vue'
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
import EChartsComponent from '@/components/EChartsComponent.vue'
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

// 模拟用户数据
const mockUsers = ref([
    {
        id: 1,
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        phone: '13800138001',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'admin',
        status: 'active',
        department: 'tech',
        remark: '系统管理员',
        createTime: '2023-01-01 10:00:00'
    },
    {
        id: 2,
        username: 'user1',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138002',
        avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
        role: 'user',
        status: 'active',
        department: 'product',
        remark: '产品经理',
        createTime: '2023-01-02 14:30:00'
    },
    {
        id: 3,
        username: 'user2',
        name: '李四',
        email: 'lisi@example.com',
        phone: '13800138003',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        role: 'user',
        status: 'disabled',
        department: 'operation',
        remark: '运营专员',
        createTime: '2023-01-03 09:15:00'
    },
    {
        id: 4,
        username: 'moderator',
        name: '王五',
        email: 'wangwu@example.com',
        phone: '13800138004',
        avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png',
        role: 'moderator',
        status: 'active',
        department: 'marketing',
        remark: '市场版主',
        createTime: '2023-01-04 16:45:00'
    },
    {
        id: 5,
        username: 'user3',
        name: '赵六',
        email: 'zhaoliu@example.com',
        phone: '13800138005',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'user',
        status: 'active',
        department: 'hr',
        remark: '人事专员',
        createTime: '2023-01-05 11:20:00'
    }
])

// 图表配置
const roleChartOption = computed(() => {
    const roleStats = mockUsers.value.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
    }, {})

    return {
        title: {
            text: '用户角色分布',
            left: 'center',
            textStyle: { fontSize: 14 }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
            {
                name: '角色分布',
                type: 'pie',
                radius: '60%',
                center: ['50%', '60%'],
                data: [
                    { value: roleStats.admin || 0, name: '管理员' },
                    { value: roleStats.moderator || 0, name: '版主' },
                    { value: roleStats.user || 0, name: '普通用户' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
})

const statusChartOption = computed(() => {
    const statusStats = mockUsers.value.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1
        return acc
    }, {})

    return {
        title: {
            text: '用户状态统计',
            left: 'center',
            textStyle: { fontSize: 14 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
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
                    statusStats.active || 0,
                    statusStats.disabled || 0
                ],
                itemStyle: {
                    color: function(params) {
                        const colors = ['#67c23a', '#f56c6c']
                        return colors[params.dataIndex]
                    }
                }
            }
        ]
    }
})

// 获取用户列表
const fetchUsers = async () => {
    loading.value = true

    try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))

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

        // 更新本地数据
        const userIndex = mockUsers.value.findIndex(user => user.id === row.id)
        if (userIndex !== -1) {
            mockUsers.value[userIndex].status = row.status
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

        // 从本地数据中删除
        const userIndex = mockUsers.value.findIndex(user => user.id === row.id)
        if (userIndex !== -1) {
            mockUsers.value.splice(userIndex, 1)
        }

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

        // 从本地数据中删除选中的用户
        const selectedIds = selectedRows.value.map(row => row.id)
        mockUsers.value = mockUsers.value.filter(user => !selectedIds.includes(user.id))

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
        // 编辑模式：更新现有用户
        const userIndex = mockUsers.value.findIndex(user => user.id === userData.id)
        if (userIndex !== -1) {
            mockUsers.value[userIndex] = { ...userData }
        }
        ElMessage.success('用户信息更新成功')
    } else {
        // 新增模式：添加新用户
        mockUsers.value.push({
            ...userData,
            id: Date.now(),
            createTime: new Date().toLocaleString()
        })
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

    .charts-row {
        margin-top: 20px;

        .chart-card {
            height: 400px;

            :deep(.el-card__body) {
                height: calc(100% - 60px);
            }
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

        .charts-row {
            .el-col {
                margin-bottom: 20px;
            }
        }
    }
}
</style>