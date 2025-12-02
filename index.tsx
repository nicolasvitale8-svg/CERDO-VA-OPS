import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          backgroundColor: '#05070B', 
          color: '#F97373', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          fontFamily: 'monospace'
        }}>
          <h1 style={{fontSize: '2rem', marginBottom: '1rem'}}>⚠️ ALGO SALIÓ MAL</h1>
          <div style={{border: '1px solid #343C4F', padding: '1.5rem', borderRadius: '8px', maxWidth: '600px', width: '100%'}}>
            <p style={{color: '#A2ADC7', marginBottom: '0.5rem'}}>Detalle del error:</p>
            <pre style={{whiteSpace: 'pre-wrap', color: '#F5F7FF', backgroundColor: '#0C1017', padding: '1rem', borderRadius: '4px'}}>
              {this.state.error?.message || 'Error desconocido'}
            </pre>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                marginTop: '1.5rem',
                backgroundColor: '#FF4B7D',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              BORRAR CACHÉ Y REINICIAR
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);