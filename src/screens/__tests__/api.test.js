import { render, fireEvent } from '@testing-library/react-native';
import React, { useEffect, useReducer } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';
const DEFAULT_INPUT_CHEF = 'What did you inspect?';
const DEFAULT_INPUT_CUSTOMER = 'What banana?';

const TEST_ID = {
  bananaFresh: 'bananaFresh',
  bananaCustomFreshness: 'bananaCustomFreshness',
  bananaChef: 'bananaChef',
  duplicateText: 'duplicateText',
};

function MyButton({ onPress, children }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}

function Banana({ onUpdate, onUnmount }) {
  const [fresh, toggleFresh] = useReducer((s) => !s, false);
  const test = 0;

  useEffect(() => {
    onUpdate?.();
    return () => {
      onUnmount?.();
    };
  }, [fresh, onUnmount, onUpdate]);

  return (
    <View>
      <Text>Is the banana fresh?</Text>
      <Text testID={TEST_ID.bananaFresh}>{fresh ? 'fresh' : 'not fresh'}</Text>
      <TextInput
        testID={TEST_ID.bananaCustomFreshness}
        placeholder={PLACEHOLDER_FRESHNESS}
        value={INPUT_FRESHNESS}
      />
      <TextInput
        testID={TEST_ID.bananaChef}
        placeholder={PLACEHOLDER_CHEF}
        value={INPUT_CHEF}
        defaultValue={DEFAULT_INPUT_CHEF}
      />
      <TextInput defaultValue={DEFAULT_INPUT_CUSTOMER} />
      <TextInput defaultValue={'hello'} value='' />
      <MyButton onPress={toggleFresh} type='primary'>
        Change freshness!
      </MyButton>
      <Text testID={TEST_ID.duplicateText}>First Text</Text>
      <Text testID={TEST_ID.duplicateText}>Second Text</Text>
      <Text>{test}</Text>
    </View>
  );
}

function UseEffect({ cb }) {
  useEffect(cb);

  return null;
}

describe('render api', () => {
  it('UNSAFE_getAllByType, UNSAFE_queryAllByType', () => {
    const { UNSAFE_getAllByType, UNSAFE_queryAllByType } = render(<Banana />);
    const [text, status, button] = UNSAFE_getAllByType(Text);
    const InExistent = () => null;

    expect(text.props.children).toBe('Is the banana fresh?');
    expect(status.props.children).toBe('not fresh');
    expect(button.props.children).toBe('Change freshness!');
    expect(() => UNSAFE_getAllByType(InExistent)).toThrow('No instances found');

    expect(UNSAFE_queryAllByType(Text)[1]).toBe(status);
    expect(UNSAFE_queryAllByType(InExistent)).toHaveLength(0);
  });

  it('UNSAFE_getByProps, UNSAFE_queryByProps', () => {
    const { UNSAFE_getByProps, UNSAFE_queryByProps } = render(<Banana />);
    const primaryType = UNSAFE_getByProps({ type: 'primary' });

    expect(primaryType.props.children).toBe('Change freshness!');
    expect(() => UNSAFE_getByProps({ type: 'inexistent' })).toThrow(
      'No instances found',
    );

    expect(UNSAFE_queryByProps({ type: 'primary' })).toBe(primaryType);
    expect(UNSAFE_queryByProps({ type: 'inexistent' })).toBeNull();
  });

  it('UNSAFE_getAllByProp, UNSAFE_queryAllByProps', () => {
    const { UNSAFE_getAllByProps, UNSAFE_queryAllByProps } = render(<Banana />);
    const primaryTypes = UNSAFE_getAllByProps({ type: 'primary' });

    expect(primaryTypes).toHaveLength(1);
    expect(() => UNSAFE_getAllByProps({ type: 'inexistent' })).toThrow(
      'No instances found',
    );

    expect(UNSAFE_queryAllByProps({ type: 'primary' })).toEqual(primaryTypes);
    expect(UNSAFE_queryAllByProps({ type: 'inexistent' })).toHaveLength(0);
  });

  it('update', () => {
    const fn = jest.fn();
    const { getByText, update, rerender } = render(<Banana onUpdate={fn} />);

    fireEvent.press(getByText('Change freshness!'));

    update(<Banana onUpdate={fn} />);
    rerender(<Banana onUpdate={fn} />);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('unmount', () => {
    const fn = jest.fn();
    const { unmount } = render(<Banana onUnmount={fn} />);
    unmount();

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('toJSON', () => {
    const { toJSON } = render(<Banana />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('debug', () => {
    // jest.spyOn(console, 'log').mockImplementation((x) => x);
    // const { debug } = render(<Banana />);
    // debug();
    // debug('my custom message');
    // debug.shallow();
    // debug.shallow('my other custom message');
    // const mockCalls = console.log.mock.calls;
    // console.log({ mockCalls });
    // expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
  });

  it('renders options.wrapper around node', () => {
    const WrapperComponent = ({ children }) => (
      <SafeAreaView testID='wrapper'>{children}</SafeAreaView>
    );

    const { toJSON, getByTestId } = render(<View testID='inner' />, {
      wrapper: WrapperComponent,
    });

    expect(getByTestId('wrapper')).toBeTruthy();
    expect(toJSON()).toMatchInlineSnapshot(`
      <RCTSafeAreaView
        emulateUnlessSupported={true}
        testID="wrapper"
      >
        <View
          testID="inner"
        />
      </RCTSafeAreaView>
    `);
  });

  it('renders options.wrapper around updated node', () => {
    const WrapperComponent = ({ children }) => (
      <SafeAreaView testID='wrapper'>{children}</SafeAreaView>
    );

    const { toJSON, getByTestId, rerender } = render(<View testID='inner' />, {
      wrapper: WrapperComponent,
    });

    rerender(
      <View
        testID='inner'
        accessibilityLabel='test'
        accessibilityHint='test'
      />,
    );

    expect(getByTestId('wrapper')).toBeTruthy();
    expect(toJSON()).toMatchInlineSnapshot(`
      <RCTSafeAreaView
        emulateUnlessSupported={true}
        testID="wrapper"
      >
        <View
          accessibilityHint="test"
          accessibilityLabel="test"
          testID="inner"
        />
      </RCTSafeAreaView>
    `);
  });

  it('returns container', () => {
    const { container } = render(<View testID='inner' />);

    expect(container).toBeDefined();
    expect(container.type).toBe(View);
    expect(container.props.testID).toBe('inner');
  });

  it('returns wrapped component as container', () => {
    const WrapperComponent = ({ children }) => (
      <SafeAreaView testID='wrapper'>{children}</SafeAreaView>
    );

    const { container } = render(<View testID='inner' />, {
      wrapper: WrapperComponent,
    });

    expect(container).toBeDefined();
    expect(container.type).toBe(WrapperComponent);
    expect(container.props.testID).not.toBeDefined();
  });

  it('update should trigger useEffect', () => {
    const cb = jest.fn();
    const { update } = render(<UseEffect cb={cb} />);
    update(<UseEffect cb={cb} />);

    expect(cb).toHaveBeenCalledTimes(2);
  });
});
