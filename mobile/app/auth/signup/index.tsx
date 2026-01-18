import React, { useState } from 'react';
import AuthWrapper, { AuthForm } from '../components/auth-wrapper';
import { GradientButton } from '@/components/button';
import TextInput from '@/components/forms/text-input';
import { ThemedText } from '@/components/ThemedText';
import { ApiError } from '@/utils/http/api-error';
import { router } from 'expo-router';
import { AuthService } from '@/services';

interface FormData {
  username: {
    value: string;
    error: string | null;
  };
  email: {
    value: string;
    error: string | null;
  };
  password: {
    value: string;
    error: string | null;
  };
  confirmPassword: {
    value: string;
    error: string | null;
  };
}

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: { value: '', error: null },
    email: { value: '', error: null },
    password: { value: '', error: null },
    confirmPassword: { value: '', error: null },
  });

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: { value, error: null } });
  };

  const validateForm = () => {
    // Reset errors
    const errors: FormData = {
      username: { value: formData.username.value, error: null },
      email: { value: formData.email.value, error: null },
      password: { value: formData.password.value, error: null },
      confirmPassword: { value: formData.confirmPassword.value, error: null },
    };

    let hasErrors = false;

    // Validate username: only alphanumeric, ".", "_", "-"
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!formData.username.value.trim()) {
      errors.username.error = 'O nome de utilizador é obrigatório';
      hasErrors = true;
    } else if (!usernameRegex.test(formData.username.value)) {
      errors.username.error = 'O nome de utilizador só pode conter letras, números, ".", "_" e "-"';
      hasErrors = true;
    }

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

    // Validate confirm password
    if (!formData.confirmPassword.value) {
      errors.confirmPassword.error = 'Por favor, confirme a senha';
      hasErrors = true;
    } else if (formData.password.value !== formData.confirmPassword.value) {
      errors.confirmPassword.error = 'As senhas não coincidem';
      hasErrors = true;
    }

    // Update form data with errors
    setFormData(errors);

    // If no errors, proceed with submission
    console.log('Form is valid:', formData);

    if (hasErrors) {
      return null;
    }

    return {
      username: formData.username.value,
      email: formData.email.value,
      password: formData.password.value,
      confirmPassword: formData.confirmPassword.value,
    };
  };

  const handleSubmit = async () => {
    const formData = validateForm();
    if (!formData) return;

    setLoading(true);

    try {
      await AuthService.signUp(formData);
      router.push('/auth/login');
    } catch (error) {
      if (error instanceof ApiError) {
        setResponseMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper type="signup">
      {responseMessage && <ThemedText>{responseMessage}</ThemedText>}

      <AuthForm>
        <TextInput
          label="Username"
          placeholder="hojiyahenda.@gmail.com"
          value={formData.username.value}
          errorMessage={formData.username.error}
          onChangeText={(text) => handleChange('username', text)}
        />
        <TextInput
          label="Email"
          keyboardType="email-address"
          placeholder="hojiyahenda.@gmail.com"
          value={formData.email.value}
          errorMessage={formData.email.error}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          label="Senha"
          secureTextEntry
          placeholder="********"
          keyboardType="visible-password"
          value={formData.password.value}
          errorMessage={formData.password.error}
          onChangeText={(text) => handleChange('password', text)}
        />
        <TextInput
          secureTextEntry
          label="Confirmar senha"
          placeholder="********"
          keyboardType="visible-password"
          value={formData.confirmPassword.value}
          errorMessage={formData.confirmPassword.error}
          onChangeText={(text) => handleChange('confirmPassword', text)}
        />
        <GradientButton onPress={handleSubmit}>
          {loading ? 'Carregando...' : 'Criar conta'}
        </GradientButton>
      </AuthForm>
    </AuthWrapper>
  );
};

export default SignupPage;
