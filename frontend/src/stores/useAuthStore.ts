import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService.ts';
import type { AuthState } from '@/types/store.ts';
import { persist } from 'zustand/middleware';
import { useChatStore } from '@/stores/useChatStore.ts';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            loading: false,

            setAccessToken: (accessToken) => {
                set({ accessToken });
            },

            setUser: (user) => {
                set({ user });
            },

            clearState: () => {
                set({
                    accessToken: null,
                    user: null,
                    loading: false,
                });
                useChatStore.getState().reset();
                localStorage.clear();
                sessionStorage.clear();
            },

            signUp: async (username, password, email, firstName, lastName) => {
                try {
                    set({ loading: true });

                    //call api
                    await authService.signUp(
                        username,
                        password,
                        email,
                        firstName,
                        lastName,
                    );

                    toast.success(
                        'Successfully signed up! You will be redirected to the login page in a few seconds',
                    );
                } catch (error) {
                    console.error(error);
                    toast.error('Something went wrong');
                } finally {
                    set({ loading: false });
                }
            },

            signIn: async (username, password) => {
                try {
                    get().clearState();
                    set({ loading: true });

                    localStorage.clear();
                    useChatStore.getState().reset();

                    const { accessToken } = await authService.signIn(
                        username,
                        password,
                    );

                    get().setAccessToken(accessToken);

                    await get().fetchMe();
                    useChatStore.getState().fetchConversations();

                    toast.success('Welcome back to Moji!');
                } catch (error) {
                    console.error(error);
                    toast.error('Sign in failed, please try again');
                } finally {
                    set({ loading: false });
                }
            },

            signOut: async () => {
                try {
                    get().clearState();
                    await authService.signOut();
                    toast.success('Successfully signed out');
                } catch (error) {
                    console.error(error);
                    toast.error('Something went wrong');
                }
            },

            fetchMe: async () => {
                try {
                    set({ loading: true });
                    const user = await authService.fetchMe();

                    set({ user });
                } catch (error) {
                    console.error(error);
                    set({ user: null, accessToken: null });
                    toast.error(
                        'Error when fetching user, please try again later',
                    );
                } finally {
                    set({ loading: false });
                }
            },

            refresh: async () => {
                try {
                    set({ loading: true });
                    const { user, fetchMe, setAccessToken } = get();
                    const accessToken = await authService.refresh();

                    setAccessToken(accessToken);

                    if (!user) {
                        await fetchMe();
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(
                        'Your session is time out. Please sign in to continue!',
                    );
                    get().clearState();
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => {
                return { user: state.user };
            },
        },
    ),
);
