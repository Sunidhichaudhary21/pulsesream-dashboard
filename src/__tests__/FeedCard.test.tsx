import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../store';
import { FeedCard } from '../components/feed/FeedCard';
import { ContentItem } from '../types/content';

const mockItem: ContentItem = {
  id: 'test-1',
  type: 'news',
  category: 'technology',
  title: 'Quantum Computing Update',
  description: 'A revolutionary breakdown of quantum error correction.',
  image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
  imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
  author: { name: 'Dr. Elena' },
  publishedAt: new Date().toISOString(),
  metrics: { likes: 150 },
  tags: ['Quantum', 'Physics'],
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('FeedCard Component', () => {
  it('renders title, description, and author correctly', () => {
    renderWithProvider(<FeedCard item={mockItem} />);

    expect(screen.getByText('Quantum Computing Update')).toBeDefined();
    expect(screen.getByText('A revolutionary breakdown of quantum error correction.')).toBeDefined();
    expect(screen.getByText('Dr. Elena')).toBeDefined();
  });

  it('renders favorite button with accessible label', () => {
    renderWithProvider(<FeedCard item={mockItem} />);

    const favoriteButton = screen.getByRole('button', { name: /add quantum computing update to favorites/i });
    expect(favoriteButton).toBeDefined();

    fireEvent.click(favoriteButton);
  });
});
