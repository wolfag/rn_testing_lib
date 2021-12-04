import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './src/screens/SignIn';
import Example from './src/screens/Example';
import configureStore from './src/store';
import { Provider } from 'react-redux';

const Stack = createStackNavigator();
const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='SignIn'
            component={SignIn}
            options={{ title: 'Sign In' }}
          />
          <Stack.Screen
            name='App'
            component={Example}
            options={{ title: 'Success!' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
