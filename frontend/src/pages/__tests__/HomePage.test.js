import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '../../test-utils';
import HomePage from '../HomePage';
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

describe('HomePage Component', () => {
  const mockFandoms = [
    { id: 1, name: 'Naruto', slug: 'naruto', description: 'Ninja world', category: 'anime', members_count: 100, image_url: null },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockFandoms });
    api.post.mockResolvedValue({ data: {} });
  });

  it('renders the page title', async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getAllByText(/Знайди свій Фандом/i).length).toBeGreaterThan(0);
  });

  it('renders the subtitle', async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getAllByText(/Спілкуйся з тими, хто розуміє твої інтереси/i).length).toBeGreaterThan(0);
  });

  it('renders category filter buttons', async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getAllByText('Всі').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Аніме').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Книги').length).toBeGreaterThan(0);
  });

  it('allows user to type in search', async () => {
    await act(async () => { render(<HomePage />); });
    const searchInput = screen.getByPlaceholderText('Пошук...');
    fireEvent.change(searchInput, { target: { value: 'Naruto' } });
    expect(searchInput).toHaveValue('Naruto');
  });

  it('renders fandom cards when data is preloaded', async () => {
    const fandoms = [
      { id: 1, name: 'Naruto', slug: 'naruto', description: 'Ninja world', category: 'anime', members_count: 100, image_url: null },
    ];
    await act(async () => {
      render(<HomePage />, {
        preloadedState: {
          fandoms: { list: fandoms, loading: false, error: null, currentFandom: null },
          auth: { isAuthenticated: false, user: null, loading: false, error: null },
        },
      });
    });
    expect(screen.getAllByText('Naruto').length).toBeGreaterThan(0);
  });
});
