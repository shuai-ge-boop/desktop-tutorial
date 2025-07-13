import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  
  // 登录操作
  const login = async (loginData) => {
    try {
      // 模拟登录API调用
      // 实际项目中应该调用真实的登录接口
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟登录成功
      const mockToken = 'mock-jwt-token-' + Date.now()
      const mockUserInfo = {
        id: 1,
        username: loginData.username,
        name: '管理员',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        roles: ['admin']
      }
      
      // 保存到状态和本地存储
      token.value = mockToken
      userInfo.value = mockUserInfo
      localStorage.setItem('token', mockToken)
      localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))
      
      return { success: true, message: '登录成功' }
    } catch (error) {
      return { success: false, message: '登录失败' }
    }
  }
  
  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  
  // 获取用户信息
  const getUserInfo = () => {
    return userInfo.value
  }
  
  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    getUserInfo
  }
}) 