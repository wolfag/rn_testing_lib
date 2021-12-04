import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { Button, ErrorText, Input } from '../components/Form';

const useLoginFormState = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);

  let isUsernameValid = false;
  let isPasswordValid = false;
  let usernameErrorMsg;
  let passwordErrorMsg;

  if (username === 'example') {
    isUsernameValid = true;
  }

  if (password === 'asdf') {
    isPasswordValid = true;
  }

  if (submit && !isUsernameValid) {
    usernameErrorMsg = 'Invalid username.';
  }

  if (submit && !isPasswordValid) {
    passwordErrorMsg = 'Invalid password.';
  }

  const handleSubmit = () => {
    setSubmit(true);

    if (!isUsernameValid || !isPasswordValid) return;

    fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then(() => {
        navigation.push('App');
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  return {
    username: {
      value: username,
      set: setUsername,
      valid: isUsernameValid,
      error: usernameErrorMsg,
    },
    password: {
      value: password,
      set: setPassword,
      valid: isPasswordValid,
      error: passwordErrorMsg,
    },
    submit: {
      value: submit,
      go: handleSubmit,
    },
  };
};

export default function SignIn() {
  const { username, password, submit } = useLoginFormState();

  return (
    <KeyboardAvoidingView style={styles.container} behavior='position'>
      <Text style={styles.headerText}>Login</Text>
      <Input
        label='Username'
        placeholder='example'
        onChangeText={username.set}
        error={username.error}
        testID='SignIn.usernameInput'
      />
      <Input
        label='Password'
        placeholder='***'
        secureTextEntry
        onChangeText={password.set}
        error={password.error}
        testID='SignIn.passwordInput'
      />
      <ErrorText messages={[username.error, password.error]} />
      <Button testID='SignIn.Button' text='Login' onPress={submit.go} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  headerText: {
    color: '#353031',
    fontWeight: 'bold',
    fontSize: 34,
    marginBottom: 10,
  },
});
