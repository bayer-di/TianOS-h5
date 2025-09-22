import { get, post } from './http'

// 用户相关接口
export const userApi = {
  // 登录
  login: (data: { username: string; password: string }) => 
    post<{ token: string; user: any }>('/user/login', data),
  
  // 获取用户信息
  getUserInfo: () => 
    get<{ user: any }>('/user/info'),
  
  // 退出登录
  logout: () => 
    post('/user/logout')
};

// 其他API模块可以按需添加
// export const otherApi = { ... };
