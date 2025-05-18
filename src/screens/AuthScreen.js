import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';

const BASE_URL = 'http://192.168.4.41:3000';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const toggleMode = () => {
    setIsLogin(prev => !prev);
    setName(''); setEmail(''); setPassword('');
  };

  const handleAuth = async () => {
    if ((!isLogin && !name.trim()) || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const endpoint = isLogin ? 'signin' : 'signup';
    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(`${BASE_URL}/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        dispatch(loginSuccess({
          token: data.token,
          user:  { id: data.id, name: data.name, email: data.email }
        }));
        // **DON’T** call navigation.replace() here
        return;
      }
      Alert.alert('Error', data.message || 'Authentication failed.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network issue or server not running');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Text>

      {!isLogin && (
        <TextInput
          placeholder="Name"
          placeholderTextColor="#666"
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        placeholder="Email address"
        placeholderTextColor="#666"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleMode}>
        <Text style={styles.toggleText}>
          {isLogin
            ? 'New here? Create account'
            : 'Have an account? Log in'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    padding: 24
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
    color: '#111'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#111',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500'
  },
  toggleText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 15
  }
});
