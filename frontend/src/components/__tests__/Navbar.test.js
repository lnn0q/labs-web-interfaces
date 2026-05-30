import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import Navbar from '../Navbar';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  },
}));

describe('Navbar Component', () => {
  it('renders the brand name "Takibi"', () => {
    render(<Navbar />);
    expect(screen.getAllByText(/Takibi/i).length).toBeGreaterThan(0);
  });

  it('renders "Про нас" link', () => {
    render(<Navbar />);
    expect(screen.getByText(/Про нас/i)).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: null, loading: false, error: null },
      },
    });
    expect(screen.getByText(/Увійти/i)).toBeInTheDocument();
  });

  it('shows user icon when authenticated', () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { id: 1, name: 'Test', is_staff: false }, loading: false, error: null },
      },
    });
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
  });

  it('renders the fire icon', () => {
    render(<Navbar />);
    expect(screen.getByTestId('LocalFireDepartmentIcon')).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { id: 1, name: 'Test', is_staff: false }, loading: false, error: null },
      },
    });
    
    // Open menu
    fireEvent.click(screen.getByTestId('AccountCircleIcon').closest('button'));
    
    // Click logout
    const logoutBtn = screen.getByText(/Вийти/i);
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
  });
});
