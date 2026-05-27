import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  email: string;
  password?: string;
  isGoogle: boolean;
}

export interface MetricSnapshot {
  currentMRR: number;
  activeUsersCount: number;
  churnRate: number;
}

export interface DataPoint {
  timestamp: string;
  revenue: number;
  activeUsers: number;
}

interface DashboardState {
  isAuthenticated: boolean;
  loginError: string | null;
  users: User[];
  metrics: MetricSnapshot;
  historicalData: DataPoint[];
  login: (email: string, password: string) => void;
  logout: () => void;
  registerUser: (email: string, password?: string, isGoogle?: boolean) => boolean;
  updateLiveStream: (newDataPoint: DataPoint) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loginError: null,
      users: [],
      metrics: {
        currentMRR: 45000,
        activeUsersCount: 1200,
        churnRate: 2.4,
      },
      historicalData: [
        { timestamp: '10:00 AM', revenue: 45000, activeUsers: 1200 },
      ],

      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email === email.toLowerCase() && u.password === password
        );
        if (user) {
          set({ isAuthenticated: true, loginError: null });
        } else {
          set({ loginError: 'Invalid administrative credentials.' });
        }
      },

      logout: () => set({ isAuthenticated: false }),

      registerUser: (email, password, isGoogle = false) => {
        const normalizedEmail = email.toLowerCase();
        const exists = get().users.some((u) => u.email === normalizedEmail);

        if (exists) return false;

        const newUser = { email: normalizedEmail, password, isGoogle };
        set({ users: [...get().users, newUser] });
        return true;
      },

      updateLiveStream: (newDataPoint) => {
        set((state) => {
          const updatedHistory = [...state.historicalData, newDataPoint].slice(-20);
          return {
            historicalData: updatedHistory,
            metrics: {
              ...state.metrics,
              currentMRR: Math.floor(newDataPoint.revenue),
              activeUsersCount: newDataPoint.activeUsers,
            },
          };
        });
      },
    }),
    {
      name: 'nexus-portal-storage', // Key used inside localstorage
    }
  )
);