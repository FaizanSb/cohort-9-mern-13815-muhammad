import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';

// AuthContext ke andar API call hoti hai — usko yahan "mock" kar rahe hain
// taake test real backend se connect na ho, sirf component ka behavior check ho
jest.mock('../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.reject({ response: { status: 401 } })), // /me call, "not logged in" simulate
    post: jest.fn(() => Promise.resolve({ data: { user: { id: '1', name: 'Test', email: 'test@example.com' } } })),
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
  it('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('renders the login button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('allows typing into email and password fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123456');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('123456');
  });

  it('shows link to signup page', () => {
    renderLogin();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});