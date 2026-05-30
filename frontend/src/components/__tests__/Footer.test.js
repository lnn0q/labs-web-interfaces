import React from 'react';
import { render, screen } from '../../test-utils';
import Footer from '../Footer';

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

describe('Footer Component', () => {
  it('renders the Takibi brand name', () => {
    render(<Footer />);
    expect(screen.getAllByText(/Takibi/i)[0]).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<Footer />);
    expect(screen.getByText(/Денисенко Богдан/i)).toBeInTheDocument();
  });

  it('renders the "Про додаток" link', () => {
    render(<Footer />);
    expect(screen.getByText(/Про додаток/i)).toBeInTheDocument();
  });

  it('renders the "Фандоми" link', () => {
    render(<Footer />);
    expect(screen.getByText(/Фандоми/i)).toBeInTheDocument();
  });

  it('has correct href for "Про додаток" link', () => {
    render(<Footer />);
    const link = screen.getByText(/Про додаток/i);
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders copyright year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
