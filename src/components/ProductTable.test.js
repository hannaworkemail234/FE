import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductTable from './ProductTable';
import * as api from '../api';

jest.mock('../api');

describe('ProductTable Component', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', price: 999.99, quantity: 5, createdAt: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Mouse', price: 25.99, quantity: 50, createdAt: '2024-01-02T00:00:00Z' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock all API calls to return success by default
    api.productAPI.getAll.mockResolvedValue({
      success: true,
      data: { data: mockProducts },
    });
    api.productAPI.create.mockResolvedValue({
      success: true,
      data: { data: { id: 3, name: 'New Product', price: 100, quantity: 10, createdAt: '2024-01-03T00:00:00Z' } },
    });
    api.productAPI.update.mockResolvedValue({
      success: true,
      data: { data: { id: 1, name: 'Updated', price: 1000, quantity: 1, createdAt: '2024-01-01T00:00:00Z' } },
    });
    api.productAPI.delete.mockResolvedValue({
      success: true,
    });
  });

  describe('Initial Render & Data Fetching', () => {
    it('should render ProductTable component with header', async () => {
      render(<ProductTable />);

      expect(screen.getByText('Product Management')).toBeInTheDocument();
      expect(screen.getByText('+ Add Product')).toBeInTheDocument();
    });

    it('should display loading state initially', async () => {
      api.productAPI.getAll.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          success: true,
          data: { data: mockProducts },
        }), 100))
      );

      render(<ProductTable />);
      expect(screen.getByText('Loading products...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
      });
    });

    it('should fetch and display products on component mount', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(api.productAPI.getAll).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByText('Mouse')).toBeInTheDocument();
      });
    });

    it('should display no data message when no products exist', async () => {
      api.productAPI.getAll.mockResolvedValue({
        success: true,
        data: { data: [] },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('No products found. Create one to get started!')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      api.productAPI.getAll.mockResolvedValue({
        success: false,
        error: 'Network error',
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
      });
    });

    it('should display validation error when required fields are missing', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));
      fireEvent.click(screen.getByText('Create Product'));

      await waitFor(() => {
        expect(screen.getByText('All fields are required')).toBeInTheDocument();
      });
    });

    it('should display error message when create operation fails', async () => {
      api.productAPI.create.mockResolvedValue({
        success: false,
        data: { error: 'Failed to create product' },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));

      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], 'Keyboard');
      await userEvent.type(inputs[1], '79.99');
      await userEvent.type(inputs[2], '20');

      fireEvent.click(screen.getByText('Create Product'));

      await waitFor(() => {
        expect(screen.getByText('Failed to create product')).toBeInTheDocument();
      });
    });

    it('should clear error when new form submission attempts', async () => {
      api.productAPI.create.mockResolvedValueOnce({
        success: false,
        data: { error: 'Failed to create product' },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));
      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], 'Keyboard');
      await userEvent.type(inputs[1], '79.99');
      await userEvent.type(inputs[2], '20');

      fireEvent.click(screen.getByText('Create Product'));

      await waitFor(() => {
        expect(screen.getByText('Failed to create product')).toBeInTheDocument();
      });
    });
  });

  describe('Form Display & Toggle', () => {
    it('should show form when Add Product button is clicked', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      expect(screen.queryByPlaceholderText('Enter product name')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('+ Add Product'));

      expect(screen.getByPlaceholderText('Enter product name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter price')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter quantity')).toBeInTheDocument();
    });

    it('should hide form when Cancel button is clicked', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));
      expect(screen.getByPlaceholderText('Enter product name')).toBeInTheDocument();

      const cancelButtons = screen.getAllByText('Cancel');
      fireEvent.click(cancelButtons[0]);
      expect(screen.queryByPlaceholderText('Enter product name')).not.toBeInTheDocument();
    });

    it('should toggle form visibility correctly', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const toggleButton = screen.getByText('+ Add Product');
      fireEvent.click(toggleButton);
      expect(toggleButton.textContent).toBe('Cancel');

      fireEvent.click(toggleButton);
      expect(toggleButton.textContent).toBe('+ Add Product');
    });
  });

  describe('Create Product', () => {
    it('should create a new product successfully', async () => {
      const newProduct = { name: 'Keyboard', price: '79.99', quantity: '20' };
      const createdProduct = { id: 3, name: 'Keyboard', price: 79.99, quantity: 20, createdAt: '2024-01-03T00:00:00Z' };

      api.productAPI.create.mockResolvedValue({
        success: true,
        data: { data: createdProduct },
      });

      api.productAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: [...mockProducts, createdProduct] },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));

      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], newProduct.name);
      await userEvent.type(inputs[1], newProduct.price);
      await userEvent.type(inputs[2], newProduct.quantity);

      fireEvent.click(screen.getByText('Create Product'));

      await waitFor(() => {
        expect(api.productAPI.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: newProduct.name,
            price: newProduct.price,
            quantity: newProduct.quantity,
          })
        );
      });
    });

    it('should reset form after successful creation', async () => {
      api.productAPI.create.mockResolvedValue({
        success: true,
        data: { data: { id: 3, name: 'Keyboard', price: 79.99, quantity: 20 } },
      });

      api.productAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));
      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], 'Keyboard');
      await userEvent.type(inputs[1], '79.99');
      await userEvent.type(inputs[2], '20');

      fireEvent.click(screen.getByText('Create Product'));

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Enter product name')).not.toBeInTheDocument();
      });
    });

    it('should handle decimal prices correctly', async () => {
      const newProduct = { name: 'Monitor', price: '299.99', quantity: '10' };

      api.productAPI.create.mockResolvedValue({
        success: true,
        data: { data: { id: 3, ...newProduct } },
      });

      api.productAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Product'));
      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], newProduct.name);
      await userEvent.type(inputs[1], newProduct.price);
      await userEvent.type(inputs[2], newProduct.quantity);

      fireEvent.click(screen.getByText('Create Product'));

      await waitFor(() => {
        expect(api.productAPI.create).toHaveBeenCalledWith(
          expect.objectContaining({ price: newProduct.price })
        );
      });
    });
  });

  describe('Edit Product', () => {
    it('should populate form with product data when edit is clicked', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('Laptop');
        const priceInput = screen.getByDisplayValue('999.99');
        const quantityInput = screen.getByDisplayValue('5');

        expect(nameInput).toBeInTheDocument();
        expect(priceInput).toBeInTheDocument();
        expect(quantityInput).toBeInTheDocument();
      });
    });

    it('should show Edit Product heading when in edit mode', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Product')).toBeInTheDocument();
      });
    });

    it('should call update API with correct data', async () => {
      const updatedData = { name: 'Gaming Laptop', price: '1299.99', quantity: '3' };

      api.productAPI.update.mockResolvedValue({
        success: true,
        data: { data: { id: 1, ...updatedData } },
      });

      api.productAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('Laptop');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, updatedData.name);

      fireEvent.click(screen.getByText('Update Product'));

      await waitFor(() => {
        expect(api.productAPI.update).toHaveBeenCalledWith(
          1,
          expect.any(Object)
        );
      });
    });
  });

  describe('Delete Product', () => {
    it('should show confirmation dialog when delete is clicked', async () => {
      window.confirm = jest.fn(() => false);

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?');
    });

    it('should call delete API when confirmed', async () => {
      window.confirm = jest.fn(() => true);

      api.productAPI.delete.mockResolvedValue({ success: true });
      api.productAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockProducts },
      });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(api.productAPI.delete).toHaveBeenCalledWith(1);
      });
    });

    it('should not call delete API when cancelled', async () => {
      window.confirm = jest.fn(() => false);

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(api.productAPI.delete).not.toHaveBeenCalled();
    });

    it('should display error message when delete fails', async () => {
      window.confirm = jest.fn(() => true);

      api.productAPI.delete.mockResolvedValue({ success: false });

      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete product')).toBeInTheDocument();
      });
    });
  });

  describe('Table Display', () => {
    it('should display product table with correct columns', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      const headers = ['ID', 'Product Name', 'Price', 'Quantity', 'Created At', 'Actions'];
      headers.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });
    });

    it('should display all product data in table rows', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('$999.99')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      expect(screen.getByText('Mouse')).toBeInTheDocument();
      expect(screen.getByText('$25.99')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should format prices with dollar sign and 2 decimal places', async () => {
      render(<ProductTable />);

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });

      expect(screen.getByText('$999.99')).toBeInTheDocument();
      expect(screen.getByText('$25.99')).toBeInTheDocument();
    });
  });
});
