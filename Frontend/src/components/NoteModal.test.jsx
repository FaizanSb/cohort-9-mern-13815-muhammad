import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NoteModal from './NoteModal';

describe('NoteModal - Focus Mode', () => {
  it('enters focus mode when Focus Mode button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <NoteModal
        isOpen={true}
        onClose={jest.fn()}
        onSave={jest.fn().mockResolvedValue()}
        initialData={null}
      />
    );

    expect(
      screen.getByRole('button', { name: /focus mode/i })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /focus mode/i })
    );

    expect(
      screen.getByRole('button', { name: /exit focus/i })
    ).toBeInTheDocument();
  });

  it('saves the note and exits focus mode when Escape is pressed', async () => {
    const user = userEvent.setup();

    const onSave = jest.fn().mockResolvedValue();

    render(
      <NoteModal
        isOpen={true}
        onClose={jest.fn()}
        onSave={onSave}
        initialData={{
          _id: '1',
          title: 'Test Note',
          content: '<p>This is test content</p>',
        }}
      />
    );

    await user.click(
      screen.getByRole('button', { name: /focus mode/i })
    );

    expect(
      screen.getByRole('button', { name: /exit focus/i })
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: 'Test Note',
        content: '<p>This is test content</p>',
      });
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /focus mode/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('button', { name: /exit focus/i })
    ).not.toBeInTheDocument();
  });

  it('saves the updated title and content when exiting focus mode', async () => {
    const user = userEvent.setup();

    const onSave = jest.fn().mockResolvedValue();

    render(
      <NoteModal
        isOpen={true}
        onClose={jest.fn()}
        onSave={onSave}
        initialData={{
          _id: '1',
          title: 'Old Title',
          content: '<p>Old content</p>',
        }}
      />
    );

    await user.click(
      screen.getByRole('button', { name: /focus mode/i })
    );

    const titleInput =
      screen.getByPlaceholderText('Untitled note');

    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');

    await user.click(
      screen.getByRole('button', { name: /exit focus/i })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: 'Updated Title',
        content: '<p>Old content</p>',
      });
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /focus mode/i })
      ).toBeInTheDocument();
    });
  });

  it('does not exit focus mode when save fails', async () => {
    const user = userEvent.setup();

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const onSave = jest
      .fn()
      .mockRejectedValue(new Error('Save failed'));

    render(
      <NoteModal
        isOpen={true}
        onClose={jest.fn()}
        onSave={onSave}
        initialData={{
          _id: '1',
          title: 'Test Note',
          content: '<p>This is test content</p>',
        }}
      />
    );

    await user.click(
      screen.getByRole('button', { name: /focus mode/i })
    );

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });

    // Save failed, therefore Focus Mode should remain open
    expect(
      screen.getByRole('button', { name: /exit focus/i })
    ).toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to save note:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});