import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
import { LSProvider } from './context';

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <LSProvider>
        <App />
      </LSProvider>,
    );
    expect(getByText('Measured Munch')).toBeInTheDocument();
  });
});
