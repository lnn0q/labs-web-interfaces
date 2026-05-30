import React from 'react';
import { render, screen } from '../../test-utils';
import FandomCard from '../FandomCard';

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

describe('FandomCard Component', () => {
  const mockFandom = {
    slug: 'naruto',
    name: 'Naruto',
    category: 'anime',
    description: 'A ninja world adventure',
    members_count: 150,
    image_url: 'http://example.com/naruto.jpg',
  };

  it('renders fandom name', () => {
    render(<FandomCard fandom={mockFandom} />);
    expect(screen.getByText('Naruto')).toBeInTheDocument();
  });

  it('renders fandom category in uppercase', () => {
    render(<FandomCard fandom={mockFandom} />);
    expect(screen.getByText('ANIME')).toBeInTheDocument();
  });

  it('renders fandom description', () => {
    render(<FandomCard fandom={mockFandom} />);
    expect(screen.getByText('A ninja world adventure')).toBeInTheDocument();
  });

  it('renders members count', () => {
    render(<FandomCard fandom={mockFandom} />);
    expect(screen.getByText('150 УЧАСНИКІВ')).toBeInTheDocument();
  });

  it('renders image with provided URL', () => {
    render(<FandomCard fandom={mockFandom} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'http://example.com/naruto.jpg');
  });

  it('uses placeholder image when image_url is null', () => {
    const noImageFandom = { ...mockFandom, image_url: null };
    render(<FandomCard fandom={noImageFandom} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://via.placeholder.com/400x200/1e1e1e/ff6b00');
  });

  it('links to the fandom page', () => {
    render(<FandomCard fandom={mockFandom} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/fandom/naruto');
  });
});
