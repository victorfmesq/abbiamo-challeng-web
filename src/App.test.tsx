import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders title text', () => {
    render(<App />);
    expect(screen.getByText('Dashboard de Monitoramento de Entregas')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<App />);
    expect(screen.getByText('Aplicação inicializada com sucesso!')).toBeInTheDocument();
  });
});
