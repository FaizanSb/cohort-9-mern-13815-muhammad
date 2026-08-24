import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import Login from './Login';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.reject({
        response: {
          status: 401,
        },
      })
    ),

    post: jest.fn(() =>
      Promise.resolve({
        data: {
          user: {
            id: '1',
            name: 'Test',
            email: 'test@example.com',
          },
        },
      })
    ),
  },
}));

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  it('renders email and password inputs', async () => {
    renderLogin();

    const emailInput = await screen.findByPlaceholderText(
      'you@example.com'
    );

    const passwordInput = await screen.findByPlaceholderText(
      '••••••••'
    );

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('renders the login button', async () => {
    renderLogin();

    const loginButton = await screen.findByRole('button', {
      name: /log in/i,
    });

    expect(loginButton).toBeInTheDocument();
  });

  it('allows typing into email and password fields', async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput = await screen.findByPlaceholderText(
      'you@example.com'
    );

    const passwordInput = await screen.findByPlaceholderText(
      '••••••••'
    );

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123456');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('123456');
  });

  it('shows link to signup page', async () => {
    renderLogin();

    const signupLink = await screen.findByRole('link', {
      name: /sign up/i,
    });

    expect(signupLink).toBeInTheDocument();
  });
});