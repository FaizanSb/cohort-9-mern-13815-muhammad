import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteCard from './NoteCard';

const mockNote = {
  _id: '1',
  title: 'Test Note',
  content: '<p>This is <strong>bold</strong> content</p>',
  updatedAt: new Date().toISOString(),
};

describe('NoteCard', () => {
  it('renders the note title', () => {
    render(<NoteCard note={mockNote} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('renders rich text content correctly', () => {
    render(<NoteCard note={mockNote} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('bold')).toBeInTheDocument(); // HTML render hua, raw tags nahi
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn(); // fake function jo track karta hai call hua ya nahi

    render(<NoteCard note={mockNote} onEdit={onEdit} onDelete={() => {}} />);
    await user.click(screen.getByText('Edit'));

    expect(onEdit).toHaveBeenCalledWith(mockNote);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<NoteCard note={mockNote} onEdit={() => {}} onDelete={onDelete} />);
    await user.click(screen.getByText('Delete'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});