import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  avatar?: string
}

interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      setToken: (token) => set({ token }),
      
      login: async (username, password) => {
        // 模拟登录API调用
        try {
          // 实际项目中这里应该调用真实的API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 模拟成功登录
          const mockUser = {
            id: '1',
            username,
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
          };
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser, 
            token: mockToken,
            isLoggedIn: true 
          });
          
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null,
          isLoggedIn: false 
        });
      }
    }),
    {
      name: 'app-user-storage',
    }
  )
)
