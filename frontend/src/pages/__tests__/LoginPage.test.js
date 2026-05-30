import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(() => Promise.resolve({ data: { access: 'tok', refresh: 'ref', user: { id: 1, name: 'Test' } } })),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  },
}));

describe('LoginPage Component', () => {
  it('renders login form heading', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Вхід до Takibi/i)).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('renders password input field', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Увійти/i })).toBeInTheDocument();
  });

  it('renders registration link', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Немає акаунту/i)).toBeInTheDocument();
    expect(screen.getByText(/Зареєструватися/i)).toBeInTheDocument();
  });

  it('allows user to input email', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/Email/i);
    userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('allows user to input password', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/Пароль/i);
    userEvent.type(passwordInput, 'password123');
    expect(passwordInput).toHaveValue('password123');
  });

  it('button is not disabled by default', () => {
    render(<LoginPage />);
    const btn = screen.getByRole('button', { name: /Увійти/i });
    expect(btn).not.toBeDisabled();
  });

  it('button text says "Увійти" when not loading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Увійти/i })).toBeInTheDocument();
  });

  it('shows error message when error is in state', () => {
    render(<LoginPage />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: null, loading: false, error: 'Invalid credentials' },
      },
    });
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
