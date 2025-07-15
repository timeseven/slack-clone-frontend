import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { StateCreator } from 'zustand';

export interface AuthState {
	isSignupSuccess: boolean;
	isForgotPasswordSuccess: boolean;
	isResetPasswordSuccess: boolean;
	isWorkspaceJoinSuccess: boolean;
}

export interface AuthActions {
	setIsSignupSuccess: (isSignupSuccess: boolean) => void;
	setIsForgotPasswordSuccess: (isForgotPasswordSuccess: boolean) => void;
	setIsResetPasswordSuccess: (isResetPasswordSuccess: boolean) => void;
	setIsWorkspaceJoinSuccess: (isWorkspaceJoinSuccess: boolean) => void;
}

type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set) => ({
	isSignupSuccess: false,
	isForgotPasswordSuccess: false,
	isResetPasswordSuccess: false,
	isWorkspaceJoinSuccess: false,
	setIsSignupSuccess: (success) =>
		set((state) => {
			state.isSignupSuccess = success;
		}),
	setIsForgotPasswordSuccess: (success) =>
		set((state) => {
			state.isForgotPasswordSuccess = success;
		}),
	setIsResetPasswordSuccess: (success) =>
		set((state) => {
			state.isResetPasswordSuccess = success;
		}),
	setIsWorkspaceJoinSuccess: (success) =>
		set((state) => {
			state.isWorkspaceJoinSuccess = success;
		}),
});

const useAuthStore = create<AuthSlice>()(
	devtools(
		immer((...a) => ({
			...createAuthSlice(...a),
		})),

		{ name: 'auth-devtools' }
	)
);

export default useAuthStore;
