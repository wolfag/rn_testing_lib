import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, fireEvent, render } from '@testing-library/react-native';
import { mount, shallow } from 'enzyme';
import configureStore from '../store';
import AddTodo from './AddTodo';

describe('AddTodo component test', () => {
  it('add a new TODO when the button is pressed', () => {
    const store = configureStore();

    const component = (
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    const { getByPlaceholderText, getByText } = render(component);

    const input = getByPlaceholderText(/repository/i);
    expect(input).toBeTruthy();

    const textToEnter = 'This is a random element';
    fireEvent.changeText(input, textToEnter);
    fireEvent.press(getByText('Submit form'));

    const todosState = store.getState().todos;

    expect(todosState.length).toEqual(1);

    expect(todosState).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          text: textToEnter,
          date: expect.any(Date),
        }),
      ]),
    );
  });
});
