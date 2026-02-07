import React, { useState } from 'react';
import AuthWrapper, { AuthForm } from '../components/auth-wrapper';
import TextInput from '@/components/forms/text-input';
import { GradientButton } from '@/components/button';
import { AuthService } from '../../../services/auth-service';
import { SafeStorage } from '@/utils/safe-storage';
import { ApiError } from '@/utils/http/api-error';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { constants } from '@/constants';
import { authStore } from '@/stores/auth.store';

interface FormData {
  email: {
    value: string;
    error: string | null;
  };
  password: {
    value: string;
    error: string | null;
  };
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: { value: '', error: null },
    password: { value: '', error: null },
  });

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: { value, error: null } });
  };

  const validateForm = () => {
    // Reset errors
    const errors: FormData = {
      email: { value: formData.email.value, error: null },
      password: { value: formData.password.value, error: null },
    };

    let hasErrors = false;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.value.trim()) {
      errors.email.error = 'O email é obrigatório';
      hasErrors = true;
    } else if (!emailRegex.test(formData.email.value)) {
      errors.email.error = 'Por favor, introduza um email válido';
      hasErrors = true;
    }

    // Validate password
    if (!formData.password.value) {
      errors.password.error = 'A senha é obrigatória';
      hasErrors = true;
    } else if (formData.password.value.length < 6) {
      errors.password.error = 'A senha deve ter pelo menos 6 caracteres';
      hasErrors = true;
    }

    setFormData(errors);

    if (hasErrors) {
      return null;
    }

    return {
      email: formData.email.value,
      password: formData.password.value,
    };
  };

  const handleSubmit = async () => {
    const formData = validateForm();
    if (!formData) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await AuthService.signIn(formData);
      await SafeStorage.saveObjectAsync(constants.session.tokenStorageKey, data.token);
      await SafeStorage.saveObjectAsync(constants.session.userStorageKey, data);
      authStore.user.value = {
        ...data.user,
        token: data.token,
        sessionId: data.sessionId,
      };

      router.push('/');
    } catch (error) {
      if (error instanceof ApiError) {
        setResponseMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthWrapper type="login">
      {responseMessage && <ThemedText>{responseMessage}</ThemedText>}

      <AuthForm>
        <TextInput
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email.value}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          secureTextEntry
          label="Senha"
          placeholder="Senha"
          keyboardType="visible-password"
          value={formData.password.value}
          onChangeText={(text) => handleChange('password', text)}
        />
        <GradientButton onPress={handleSubmit}>
          {loading ? 'Carregando...' : 'Entrar'}
        </GradientButton>
      </AuthForm>
    </AuthWrapper>
  );
};

export default LoginPage;
