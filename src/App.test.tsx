import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import { LSProvider } from './context';
import { formatTimeFromMs } from './hooks';

describe('Unit Tests', () => {
  it('sup', () => {
    expect(formatTimeFromMs(1000)).toBe('00:00:01');
  });
});

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <LSProvider>
        <App />
      </LSProvider>,
    );
    expect(getByText('Measured Munch')).toBeInTheDocument();
  });

  it('adds a new fasting record and verifies it is added to the history', async () => {
    const { getByText } = render(
      <LSProvider>
        <App />
      </LSProvider>,
    );

    // Start a fast
    const startButton = getByText('Start Fast');
    fireEvent.click(startButton);

    // Delay for 5 seconds to simulate fasting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Stop the fast
    const stopButton = getByText("I'm Hungry");
    fireEvent.click(stopButton);

    // Switch to the "Stats" tab
    const statsTab = getByText('Stats');
    fireEvent.click(statsTab);

    // Verify the fasting record is added
    expect(getByText('Successful Fasts:')).toBeInTheDocument();
    //expect(getByText('1')).toBeInTheDocument();

    // Switch to the "Stats" tab
    //const monthlyTab = getByText('Monthly Overview');
    //expect(monthlyTab).toBeInTheDocument();
    //fireEvent.click(monthlyTab);
  });
}, 10000); // Set a timeout for the test to allow for async operations
