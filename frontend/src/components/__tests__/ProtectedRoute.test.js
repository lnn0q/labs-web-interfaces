import React from 'react';
import { render, screen } from '../../test-utils';
import ProtectedRoute from '../ProtectedRoute';

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

describe('ProtectedRoute Component', () => {
  it('redirects to login when not authenticated', () => {
    render(
      <ProtectedRoute><div>Secret Page</div></ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: false, user: null, loading: false, error: null },
        },
        route: '/profile',
      }
    );
    expect(screen.queryByText('Secret Page')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    render(
      <ProtectedRoute><div>Secret Page</div></ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: true, user: { id: 1, name: 'Test', is_staff: false }, loading: false, error: null },
        },
      }
    );
    expect(screen.getByText('Secret Page')).toBeInTheDocument();
  });

  it('redirects non-admin from admin-only route', () => {
    render(
      <ProtectedRoute adminOnly><div>Admin Panel</div></ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: true, user: { id: 1, name: 'Test', is_staff: false }, loading: false, error: null },
        },
      }
    );
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('renders admin-only content for admin user', () => {
    render(
      <ProtectedRoute adminOnly><div>Admin Panel</div></ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: true, user: { id: 1, name: 'Admin', is_staff: true }, loading: false, error: null },
        },
      }
    );
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
