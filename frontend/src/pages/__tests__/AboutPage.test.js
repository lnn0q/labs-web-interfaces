import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import AboutPage from '../AboutPage';

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

describe('AboutPage Component', () => {
  it('renders the about page header', () => {
    render(<AboutPage />);
    expect(screen.getByText(/ПРО "TAKIBI"/i)).toBeInTheDocument();
  });

  it('renders the project description', () => {
    render(<AboutPage />);
    expect(screen.getByText(/сучасна українська платформа/i)).toBeInTheDocument();
  });

  it('renders the Kenzo mascot section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Знайомтесь - Кензо!/i)).toBeInTheDocument();
  });

  it('renders technologies section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Технології платформи/i)).toBeInTheDocument();
  });

  it('mentions React & Material-UI in technologies', () => {
    render(<AboutPage />);
    expect(screen.getByText(/React & Material-UI/i)).toBeInTheDocument();
  });

  it('mentions Django & Python in technologies', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Django & Python/i)).toBeInTheDocument();
  });

  it('renders mascot image with correct alt text', () => {
    render(<AboutPage />);
    const mascotImg = screen.getByAltText(/Маскот Кензо/i);
    expect(mascotImg).toBeInTheDocument();
    expect(mascotImg).toHaveAttribute('src', '/images/mascot.png');
  });

  it('renders the support section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Потрібна допомога/i)).toBeInTheDocument();
  });

  it('renders the telegram contact link', () => {
    render(<AboutPage />);
    expect(screen.getByText(/@lnn0q/i)).toBeInTheDocument();
  });

  it('mentions mascot description text', () => {
    render(<AboutPage />);
    expect(screen.getByText(/офіційний талісман/i)).toBeInTheDocument();
  });
});
