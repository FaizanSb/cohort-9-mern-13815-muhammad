import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NoteCard from './NoteCard';

// notesApi ko mock kar rahe hain taake Jest actual axios/API load na kare
jest.mock('../api/notesApi', () => ({
  summarizeNote: jest.fn(),
}));

const mockNote = {
  _id: '1',
  title: 'Test Note',
  content: '<p>This is <strong>bold</strong> content</p>',
  updatedAt: new Date().toISOString(),
  pinned: false,
};

describe('NoteCard', () => {
  it('renders the note title', () => {
    render(
      <NoteCard
        note={mockNote}
        onEdit={() => {}}
        onDelete={() => {}}
        onTogglePin={() => {}}
      />
    );

    expect(
      screen.getByText('Test Note')
    ).toBeInTheDocument();
  });

  it('renders rich text content correctly', () => {
    render(
      <NoteCard
        note={mockNote}
        onEdit={() => {}}
        onDelete={() => {}}
        onTogglePin={() => {}}
      />
    );

    expect(
      screen.getByText('bold')
    ).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    render(
      <NoteCard
        note={mockNote}
        onEdit={onEdit}
        onDelete={() => {}}
        onTogglePin={() => {}}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      })
    );

    expect(onEdit).toHaveBeenCalledWith(mockNote);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <NoteCard
        note={mockNote}
        onEdit={() => {}}
        onDelete={onDelete}
        onTogglePin={() => {}}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: /delete/i,
      })
    );

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});