import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./lib/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  errorMessage: (e, f) => f,
}));

test('affiche la page de connexion', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
});
