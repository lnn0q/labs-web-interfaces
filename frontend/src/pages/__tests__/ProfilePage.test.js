import React from 'react';
import { render, screen, act } from '../../test-utils';
import ProfilePage from '../ProfilePage';
import api from '../../services/api';

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

const mockUser = {
  id: 1,
  name: 'Богдан',
  email: 'bogdan@test.com',
  avatar: null,
  bio: 'Люблю аніме',
  gender: 'male',
  date_of_birth: '2000-01-01',
  last_seen: '2026-05-28T12:00:00Z',
  is_staff: false,
};

describe('ProfilePage Component', () => {
  beforeEach(() => {
    api.get.mockImplementation((url) => {
      if (url.includes('profile')) return Promise.resolve({ data: mockUser });
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ data: {} });
    api.put.mockResolvedValue({ data: mockUser });
  });

  it('shows loading spinner when user is null', async () => {
    await act(async () => {
      render(<ProfilePage />, {
        preloadedState: {
          auth: { isAuthenticated: true, user: null, loading: true, error: null },
        },
      });
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders user name when user data is available', async () => {
    await act(async () => {
      render(<ProfilePage />, {
        preloadedState: {
          auth: { isAuthenticated: true, user: mockUser, loading: false, error: null },
        },
      });
    });
    expect(screen.getAllByText('Богдан').length).toBeGreaterThan(0);
  });

  it('renders user gender in Ukrainian', async () => {
    await act(async () => {
      render(<ProfilePage />, {
        preloadedState: {
          auth: { isAuthenticated: true, user: mockUser, loading: false, error: null },
        },
      });
    });
    expect(screen.getAllByText('Чоловіча').length).toBeGreaterThan(0);
  });

  it('shows "Не вказано" for bio if missing', async () => {
    const userNoBio = { ...mockUser, bio: '' };
    api.get.mockImplementation((url) => {
      if (url.includes('profile')) return Promise.resolve({ data: userNoBio });
      return Promise.resolve({ data: [] });
    });
    await act(async () => {
      render(<ProfilePage />, {
        preloadedState: {
          auth: { isAuthenticated: true, user: userNoBio, loading: false, error: null },
        },
      });
    });
    expect(screen.getAllByText('Не вказано').length).toBeGreaterThan(0);
  });
});
