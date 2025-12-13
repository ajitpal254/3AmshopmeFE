import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

jest.mock('axios');

// Mock react-ga4 to avoid initialization errors
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}));

test('renders 3AMSHOPPEE brand', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const brandElement = screen.getByText(/3AMSHOPPEE/i);
  expect(brandElement).toBeInTheDocument();
});
