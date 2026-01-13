import { LogoComplete2 } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
interface AuthWrapperProps {
  type?: 'signup' | 'login';
}

const SignUpDescription = () => {
  return (
    <TouchableWithoutFeedback onPress={() => router.push('/auth/login')}>
      <ThemedText style={styles.descriptionText}>Possui uma conta? Faça login.</ThemedText>
    </TouchableWithoutFeedback>
  );
};

const LoginDescription = () => {
  return (
    <>
      <TouchableWithoutFeedback onPress={() => router.push('/auth/signup')}>
        <ThemedText style={styles.descriptionText}>Não possui uma conta? Cadastre-se.</ThemedText>
      </TouchableWithoutFeedback>

      {/* <TouchableOpacity onPress={() => router.push('/auth/recover-password')}>
        <ThemedText style={styles.descriptionText}>Recuperar senha</ThemedText>
      </TouchableOpacity> */}
    </>
  );
};

export const AuthForm = ({ children }: PropsWithChildren) => {
  return <View style={styles.formWrapper}>{children}</View>;
};

const AuthWrapper = ({ children, type = 'signup' }: PropsWithChildren<AuthWrapperProps>) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#61687E' }}>
      <KeyboardAwareScrollView>
        <SafeAreaView style={{ flex: 1 }}>
          <SafeHorizontalView>
            <View style={styles.logoWrapper}>
              <LogoComplete2 width={250} height={60} />
            </View>

            <View style={styles.titleWrapper}>
              <ThemedText type="title">{type === 'signup' ? 'Criar conta' : 'Login'}</ThemedText>
            </View>
            {type === 'signup' ? <SignUpDescription /> : <LoginDescription />}

            <View style={{ marginTop: 20 }}>{children}</View>
          </SafeHorizontalView>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    marginTop: 60,
    marginBottom: 50,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  titleWrapper: {
    marginBottom: 5,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  descriptionText: {
    fontWeight: '500',
    marginBottom: 10,
  },
  formWrapper: {
    gap: 15,
  },
});

export default AuthWrapper;
