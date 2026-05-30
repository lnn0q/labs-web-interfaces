import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import PostCard from '../PostCard';

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

const mockPost = {
  id: 1,
  title: 'Мій перший пост',
  content: 'Привіт усім, це тестовий контент',
  author: { id: 1, name: 'Богдан', avatar: null },
  created_at: '2026-05-28T12:00:00Z',
  likes_count: 5,
  comments_count: 2,
  is_liked: false,
  image: null,
  comments_list: null,
};

describe('PostCard Component', () => {
  it('renders post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Мій перший пост')).toBeInTheDocument();
  });

  it('renders post content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Привіт усім, це тестовий контент')).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Богдан')).toBeInTheDocument();
  });

  it('renders likes count', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders comments count', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders FavoriteBorderIcon when not liked', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
  });

  it('renders FavoriteIcon when post is liked', () => {
    const likedPost = { ...mockPost, is_liked: true };
    render(<PostCard post={likedPost} />);
    expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
  });

  it('renders post image when provided', () => {
    const postWithImage = { ...mockPost, image: 'http://example.com/img.jpg' };
    render(<PostCard post={postWithImage} />);
    const img = screen.getByAltText('Post image');
    expect(img).toHaveAttribute('src', 'http://example.com/img.jpg');
  });

  it('does not render post image when not provided', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.queryByAltText('Post image')).not.toBeInTheDocument();
  });

  it('shows "Анонім" when author name is missing', () => {
    const anonPost = { ...mockPost, author: { id: 1, name: null, avatar: null } };
    render(<PostCard post={anonPost} />);
    expect(screen.getByText('Анонім')).toBeInTheDocument();
  });

  it('renders comment icon', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByTestId('ChatBubbleOutlineIcon')).toBeInTheDocument();
  });
});
