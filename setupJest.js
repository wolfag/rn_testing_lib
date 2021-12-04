require('jest-fetch-mock').enableMocks();

const mockedNavigate = jest.fn();

// jest.mock('@react-navigation/native', () => {
//   const actualNav = jest.requireActual('@react-navigation/native');
//   return {
//     ...actualNav,
//     useNavigation: () => ({
//       navigate: mockedNavigate,
//       push: mockedNavigate,
//     }),
//   };
// });
