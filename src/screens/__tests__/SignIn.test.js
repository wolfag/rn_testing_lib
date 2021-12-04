import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

import SignIn from '../SignIn';

const flushMicrotasksQueue = () => new Promise((res) => setImmediate(res));

const mockNavigation = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    push: mockNavigation,
  }),
}));

describe('SignIn screen', () => {
  beforeEach(() => {
    mockNavigation.mockClear();
  });

  it('render default elements', () => {
    const { getAllByText, getByPlaceholderText } = render(<SignIn />);

    expect(getAllByText('Login').length).toBe(2);
    getByPlaceholderText('example');
    getByPlaceholderText('***');
  });

  it('show invalid inputs messages', () => {
    const { getByTestId, getByText } = render(<SignIn />);

    fireEvent.press(getByTestId('SignIn.Button'));
    getByText('Invalid username.');
    getByText('Invalid password.');
  });
  it('show invalid user name error messages', () => {
    const { getByTestId, getByText, queryAllByText } = render(<SignIn />);

    fireEvent.changeText(getByTestId('SignIn.passwordInput'), 'asdf');
    fireEvent.press(getByTestId('SignIn.Button'));
    getByText('Invalid username.');
    expect(queryAllByText('Invalid password.').length).toBe(0);
  });

  it('show invalid password error messages', () => {
    const { getByTestId, getByText, queryAllByText, debug } = render(
      <SignIn />,
    );

    fireEvent.changeText(getByTestId('SignIn.usernameInput'), 'example');
    fireEvent.press(getByTestId('SignIn.Button'));
    getByText('Invalid password.');
    expect(queryAllByText('Invalid username.').length).toBe(0);

    debug();
  });

  it('handle valid input submission', async () => {
    fetch.mockResponseOnce(JSON.stringify({ passes: true }));

    const { getByTestId } = render(<SignIn />);

    fireEvent.changeText(getByTestId('SignIn.usernameInput'), 'example');
    fireEvent.changeText(getByTestId('SignIn.passwordInput'), 'asdf');

    fireEvent.press(getByTestId('SignIn.Button'));

    expect(fetch.mock.calls).toMatchSnapshot();
    await act(flushMicrotasksQueue);

    expect(mockNavigation).toBeCalledWith('App');
  });
});
