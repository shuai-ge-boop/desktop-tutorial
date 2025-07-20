import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserDataStore = defineStore('userData', () => {
	// 模拟用户数据
	const users = ref([
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

	// 计算用户角色统计
	const roleStats = computed(() => {
		return users.value.reduce((acc, user) => {
			acc[user.role] = (acc[user.role] || 0) + 1
			return acc
		}, {})
	})

	// 计算用户状态统计
	const statusStats = computed(() => {
		return users.value.reduce((acc, user) => {
			acc[user.status] = (acc[user.status] || 0) + 1
			return acc
		}, {})
	})

	// 获取角色文本映射
	const getRoleText = (role) => {
		const texts = {
			admin: '管理员',
			moderator: '版主',
			user: '普通用户'
		}
		return texts[role] || '未知'
	}

	// 获取状态文本映射
	const getStatusText = (status) => {
		const texts = {
			active: '正常',
			disabled: '禁用'
		}
		return texts[status] || '未知'
	}

	// 添加用户
	const addUser = (userData) => {
		users.value.push({
			...userData,
			id: Date.now(),
			createTime: new Date().toLocaleString()
		})
	}

	// 更新用户
	const updateUser = (userData) => {
		const userIndex = users.value.findIndex(user => user.id === userData.id)
		if (userIndex !== -1) {
			users.value[userIndex] = { ...userData }
		}
	}

	// 删除用户
	const deleteUser = (userId) => {
		const userIndex = users.value.findIndex(user => user.id === userId)
		if (userIndex !== -1) {
			users.value.splice(userIndex, 1)
		}
	}

	// 批量删除用户
	const deleteUsers = (userIds) => {
		users.value = users.value.filter(user => !userIds.includes(user.id))
	}

	return {
		users,
		roleStats,
		statusStats,
		getRoleText,
		getStatusText,
		addUser,
		updateUser,
		deleteUser,
		deleteUsers
	}
})
