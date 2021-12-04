import React from 'react';
import { View, Text } from 'react-native';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';

export default function Example() {
  return (
    <View style={{ flex: 1, paddingTop: 32 }}>
      <AddTodo />
      <TodoList />
    </View>
  );
}
