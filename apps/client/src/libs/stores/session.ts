import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { User } from '@libs/zod/user.schema';

interface SessionState {
	user: User | null;
	accessToken: string | null;
}

interface SessionActions {
	setUser: (u: User | null) => void;
	setAccessToken: (t: string | null) => void;
	setSession: (payload: { user: User; accessToken: string }) => void;
	logout: () => void;
}

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,

			setUser: (user) => set({ user }),
			setAccessToken: (accessToken) => set({ accessToken }),
			setSession: ({ user, accessToken }) => set({ user, accessToken }),
			logout: () => set({ user: null, accessToken: null }),
		}),
		{
			name: 'session-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ user: state.user }),
		},
	),
);

export const useSession = () =>
	useSessionStore(
		useShallow((state) => ({
			user: state.user,
			accessToken: state.accessToken,
		})),
	);

export const useSessionActions = () =>
	useSessionStore(
		useShallow((state) => ({
			setUser: state.setUser,
			setAccessToken: state.setAccessToken,
			setSession: state.setSession,
			logout: state.logout,
		})),
	);

export const useUser = () => useSessionStore((s) => s.user);
export const useAccessToken = () => useSessionStore((s) => s.accessToken);
