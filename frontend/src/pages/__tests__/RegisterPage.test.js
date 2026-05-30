import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../RegisterPage';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  },
}));

describe('RegisterPage Component', () => {
  it('renders the registration heading', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Реєстрація у Takibi/i)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/Ім'я/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Дата народження/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /Приєднатися/i })).toBeInTheDocument();
  });

  it('renders login link', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Вже маєте акаунт/i)).toBeInTheDocument();
    expect(screen.getByText(/Увійти/i)).toBeInTheDocument();
  });

  it('allows user to type into name field', () => {
    render(<RegisterPage />);
    const nameInput = screen.getByLabelText(/Ім'я/i);
    userEvent.type(nameInput, 'Test User');
    expect(nameInput).toHaveValue('Test User');
  });

  it('allows user to type into email field', () => {
    render(<RegisterPage />);
    const emailInput = screen.getByLabelText(/Email/i);
    userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('allows user to type into password field', () => {
    render(<RegisterPage />);
    const passwordInput = screen.getByLabelText(/Пароль/i);
    userEvent.type(passwordInput, 'mypass123');
    expect(passwordInput).toHaveValue('mypass123');
  });

  it('renders the gender select with default value', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/Стать/i)).toBeInTheDocument();
  });

  it('has the submit button enabled by default', () => {
    render(<RegisterPage />);
    const btn = screen.getByRole('button', { name: /Приєднатися/i });
    expect(btn).not.toBeDisabled();
  });
});
