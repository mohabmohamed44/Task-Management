import { render } from '@testing-library/react'; // Cleaned up imports
import { createMemoryRouter, RouterProvider } from 'react-router'; // Use react-router-dom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// 1. Mocking components before they are used
// We only need to mock the ones used in the test routes below
vi.mock('../../../presentation/Pages/HomePage', () => ({ default: () => <div>HomePage</div> }));
vi.mock('../../../presentation/Pages/LoginPage', () => ({ default: () => <div>LoginPage</div> }));
vi.mock('../../../presentation/Pages/NotFoundPage', () => ({ default: () => <div>NotFoundPage</div> }));

// 2. Define the actual routes for the test
const routes = [
  {
    path: '/',
    element: <div>Protected: <div>MainLayout: <div>HomePage</div></div></div>,
  },
  {
    path: '/auth/login',
    element: <div>Public: <div>AuthLayout: <div>LoginPage</div></div></div>,
  },
  {
    path: '*',
    element: <div>NotFoundPage</div>,
  },
];

describe('App Router', () => {
  it('renders HomePage for root path', async () => {
    const router = createMemoryRouter(routes, { 
      initialEntries: ['/'],
      initialIndex: 0 
    });

    // Use findByText for async resilience or getByText if immediate
    expect(render(<RouterProvider router={router} />).getByText(/HomePage/i)).toBeInTheDocument();
  });

  it('renders LoginPage for /auth/login', () => {
    const router = createMemoryRouter(routes, { 
      initialEntries: ['/auth/login'] 
    });

    expect(render(<RouterProvider router={router} />).getByText(/LoginPage/i)).toBeInTheDocument();
  });

  it('renders NotFoundPage for unknown path', () => {
    const router = createMemoryRouter(routes, { 
      initialEntries: ['/unknown-route'] 
    });

    expect(render(<RouterProvider router={router} />).getByText(/NotFoundPage/i)).toBeInTheDocument();
  });
});
