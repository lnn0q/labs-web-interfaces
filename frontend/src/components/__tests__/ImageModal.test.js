import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import ImageModal from '../ImageModal';

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

describe('ImageModal Component', () => {
  it('renders image when open', () => {
    render(<ImageModal isOpen={true} imageUrl="http://example.com/img.jpg" onClose={() => {}} />);
    const img = screen.getByAltText('Full screen view');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/img.jpg');
  });

  it('renders close button when open', () => {
    render(<ImageModal isOpen={true} imageUrl="http://example.com/img.jpg" onClose={() => {}} />);
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });

  it('does not render image when closed', () => {
    render(<ImageModal isOpen={false} imageUrl="http://example.com/img.jpg" onClose={() => {}} />);
    expect(screen.queryByAltText('Full screen view')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<ImageModal isOpen={true} imageUrl="http://example.com/img.jpg" onClose={handleClose} />);
    fireEvent.click(screen.getByTestId('CloseIcon').closest('button'));
    expect(handleClose).toHaveBeenCalled();
  });
});
