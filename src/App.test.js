import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/UserTable', () => {
  return function MockUserTable() {
    return <div data-testid="user-table-mock">User Table Component</div>;
  };
});
jest.mock('./components/ProductTable', () => {
  return function MockProductTable() {
    return <div data-testid="product-table-mock">Product Table Component</div>;
  };
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the App component', () => {
      render(<App />);
      expect(screen.getByText(/CRUD Management System/)).toBeInTheDocument();
    });

    it('should display the main navigation bar', () => {
      render(<App />);
      expect(screen.getByText(/CRUD Management System/)).toBeInTheDocument();
      expect(screen.getByText('Users & Products Dashboard')).toBeInTheDocument();
    });

    it('should display footer with backend connection info', () => {
      render(<App />);
      expect(screen.getByText(/Connected to Backend API/)).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should render UserTable and ProductTable components', () => {
      render(<App />);
      expect(screen.getByTestId('user-table-mock')).toBeInTheDocument();
      expect(screen.getByTestId('product-table-mock')).toBeInTheDocument();
    });

    it('should have dashboard container structure', () => {
      const { container } = render(<App />);
      const dashboardContainer = container.querySelector('.dashboard-container');
      expect(dashboardContainer).toBeInTheDocument();
    });

    it('should have tables grid layout', () => {
      const { container } = render(<App />);
      const tablesGrid = container.querySelector('.tables-grid');
      expect(tablesGrid).toBeInTheDocument();
    });

    it('should have separate table sections', () => {
      const { container } = render(<App />);
      const tableSections = container.querySelectorAll('.table-section');
      expect(tableSections).toHaveLength(2);
    });
  });

  describe('CSS Classes', () => {
    it('should have correct navbar classes', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.navbar')).toBeInTheDocument();
      expect(container.querySelector('.navbar-title')).toBeInTheDocument();
      expect(container.querySelector('.navbar-subtitle')).toBeInTheDocument();
    });

    it('should have footer class', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.footer')).toBeInTheDocument();
    });

    it('should have App root class', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.App')).toBeInTheDocument();
    });
  });

  describe('Content Hierarchy', () => {
    it('should have correct heading hierarchy', () => {
      render(<App />);
      const mainHeading = screen.getByText('📊 CRUD Management System');
      expect(mainHeading.tagName).toBe('H1');
    });

    it('should have subtitle paragraph', () => {
      render(<App />);
      const subtitle = screen.getByText('Users & Products Dashboard');
      expect(subtitle.tagName).toBe('P');
    });

    it('should have footer paragraph', () => {
      render(<App />);
      const footer = screen.getByText('✓ Connected to Backend API on http://localhost:3000');
      expect(footer.tagName).toBe('P');
    });
  });

  describe('Accessibility', () => {
    it('should render without console errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      render(<App />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should render without console warnings', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      render(<App />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Component Integration', () => {
    it('should pass correct props to child components if needed', () => {
      render(<App />);
      expect(screen.getByTestId('user-table-mock')).toBeInTheDocument();
      expect(screen.getByTestId('product-table-mock')).toBeInTheDocument();
    });

    it('should render all sections in correct order', () => {
      const { container } = render(<App />);
      const navbar = container.querySelector('.navbar');
      const dashboard = container.querySelector('.dashboard-container');
      const footer = container.querySelector('.footer');

      expect(navbar).toBeInTheDocument();
      expect(dashboard).toBeInTheDocument();
      expect(footer).toBeInTheDocument();

      // Check order in DOM
      expect(navbar.compareDocumentPosition(dashboard)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(dashboard.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe('Snapshot Testing', () => {
    it('should match snapshot', () => {
      const { container } = render(<App />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
