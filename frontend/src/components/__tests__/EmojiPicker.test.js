import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import EmojiPicker from '../EmojiPicker';

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

describe('EmojiPicker Component', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders the emoji trigger button', () => {
    render(<EmojiPicker onSelect={mockOnSelect} />);
    expect(screen.getByTestId('EmojiEmotionsIcon')).toBeInTheDocument();
  });

  it('opens popover when button is clicked', () => {
    render(<EmojiPicker onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByTestId('EmojiEmotionsIcon').closest('button'));
    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('calls onSelect when an emoji is clicked', () => {
    render(<EmojiPicker onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByTestId('EmojiEmotionsIcon').closest('button'));
    fireEvent.click(screen.getByText('😊'));
    expect(mockOnSelect).toHaveBeenCalledWith('😊');
  });

  it('renders all 32 emojis in the popover', () => {
    render(<EmojiPicker onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByTestId('EmojiEmotionsIcon').closest('button'));
    expect(screen.getByText('💯')).toBeInTheDocument();
    expect(screen.getByText('👑')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });
});
