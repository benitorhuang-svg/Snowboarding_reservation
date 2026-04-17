import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '@shared';
import {
  firebaseSignInWithEmail,
  firebaseRegisterWithEmail,
  firebaseSignInWithGoogle,
  firebaseSignInWithCustomToken,
} from '@services/core/firebase';
import { useAuthStore } from '@features/auth/store/authStore';
import { authService } from '@services/modules/auth.service';
import { useNotification } from '@/core';

export const useAuthActions = (onSuccess: (userData: User) => void) => {
  const { t } = useTranslation();
  const { notify } = useNotification();
  const { syncFirebaseUser, isLoading: isAuthLoading, setUser } = useAuthStore();
  const [localIsLoading, setLocalIsLoading] = useState(false);

  const isLoading = localIsLoading || isAuthLoading;

  const handleEmailAuth = async (
    isLogin: boolean,
    email: string,
    password: string,
    name?: string,
  ) => {
    setLocalIsLoading(true);

    // Test accounts shortcut
    const testAccounts: Record<string, User> = {
      admin: {
        id: 'admin-id',
        email: 'admin@test.com',
        role: 'ADMIN',
        name: 'System Admin',
        language: 'zh-TW',
      },
    };

    if (testAccounts[email] && password === 'test') {
      setUser(testAccounts[email]);
      notify('Test Login Successful', 'success');
      setLocalIsLoading(false);
      onSuccess(testAccounts[email]);
      return;
    }

    try {
      if (isLogin) {
        await firebaseSignInWithEmail(email, password);
        notify('Login successful', 'success');
      } else {
        const userCredential = await firebaseRegisterWithEmail(email, password);
        await syncFirebaseUser(userCredential.user, {
          name: name || undefined,
          language: 'zh-TW',
          skillLevel: 'Beginner',
        });
        notify('Registration successful', 'success');
      }
    } catch (error: any) {
      notify(error?.message || 'Authentication failed', 'error');
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'line') => {
    setLocalIsLoading(true);
    try {
      if (provider === 'google') {
        await firebaseSignInWithGoogle();
      } else {
        const mockLineUserId = `line_${Math.random().toString(36).substr(2, 9)}`;
        const mockLineToken = `mock_line_token_${Date.now()}`;
        const data = await authService.lineLogin(mockLineToken, mockLineUserId);
        await firebaseSignInWithCustomToken(data.customToken);
      }
      notify(`${provider.toUpperCase()} login successful`, 'success');
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        notify(error.message || 'Social login failed', 'error');
      }
    } finally {
      setLocalIsLoading(false);
    }
  };

  return {
    handleEmailAuth,
    handleSocialLogin,
    isLoading,
    t,
  };
};
