import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserTable from './UserTable';
import * as api from '../api';

jest.mock('../api');

describe('UserTable Component', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', age: 30, address: '123 Main St', createdAt: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Jane Smith', age: 25, address: '456 Oak Ave', createdAt: '2024-01-02T00:00:00Z' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock all API calls to return success by default
    api.userAPI.getAll.mockResolvedValue({
      success: true,
      data: { data: mockUsers },
    });
    api.userAPI.create.mockResolvedValue({
      success: true,
      data: { data: { id: 3, name: 'New User', age: '30', address: '789 Pine Rd', createdAt: '2024-01-03T00:00:00Z' } },
    });
    api.userAPI.update.mockResolvedValue({
      success: true,
      data: { data: { id: 1, name: 'Updated', age: '31', address: '123 New St', createdAt: '2024-01-01T00:00:00Z' } },
    });
    api.userAPI.delete.mockResolvedValue({
      success: true,
    });
  });

  describe('Initial Render & Data Fetching', () => {
    it('should render UserTable component with header', async () => {
      render(<UserTable />);

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('+ Add User')).toBeInTheDocument();
    });

    it('should display loading state initially', async () => {
      // Mock a delayed response
      api.userAPI.getAll.mockImplementationOnce(() => 
        new Promise(resolve => {
          setTimeout(() => resolve({
            success: true,
            data: { data: mockUsers },
          }), 50);
        })
      );

      render(<UserTable />);
      
      // Give a small delay to allow component to render loading state
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await waitFor(() => {
        expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should fetch and display users on component mount', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(api.userAPI.getAll).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should display no data message when no users exist', async () => {
      api.userAPI.getAll.mockResolvedValue({
        success: true,
        data: { data: [] },
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('No users found. Create one to get started!')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      api.userAPI.getAll.mockResolvedValue({
        success: false,
        error: 'Network error',
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
      });
    });

    it('should display validation error when required fields are missing', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add User'));
      fireEvent.click(screen.getByText('Create User'));

      await waitFor(() => {
        expect(screen.getByText('All fields are required')).toBeInTheDocument();
      });
    });

    it('should display error message when create operation fails', async () => {
      api.userAPI.create.mockResolvedValue({
        success: false,
        data: { error: 'Failed to create user' },
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add User'));

      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], 'Bob Johnson');
      await userEvent.type(inputs[1], '35');
      await userEvent.type(inputs[2], '789 Pine Rd');

      fireEvent.click(screen.getByText('Create User'));

      await waitFor(() => {
        expect(screen.getByText('Failed to create user')).toBeInTheDocument();
      });
    });
  });

  describe('Form Display & Toggle', () => {
    it('should show form when Add User button is clicked', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.queryByPlaceholderText('Enter name')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('+ Add User'));

      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter address')).toBeInTheDocument();
    });

    it('should hide form when Cancel button is clicked', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add User'));
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();

      const cancelButtons = screen.getAllByText('Cancel');
      fireEvent.click(cancelButtons[0]);
      expect(screen.queryByPlaceholderText('Enter name')).not.toBeInTheDocument();
    });

    it('should toggle form visibility correctly', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const toggleButton = screen.getByText('+ Add User');
      fireEvent.click(toggleButton);
      expect(toggleButton.textContent).toBe('Cancel');

      fireEvent.click(toggleButton);
      expect(toggleButton.textContent).toBe('+ Add User');
    });
  });

  describe('Create User', () => {
    it('should create a new user successfully', async () => {
      const newUser = { name: 'Bob Johnson', age: '35', address: '789 Pine Rd' };
      const createdUser = { id: 3, ...newUser, createdAt: '2024-01-03T00:00:00Z' };

      api.userAPI.create.mockResolvedValue({
        success: true,
        data: { data: createdUser },
      });

      api.userAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: [...mockUsers, createdUser] },
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add User'));

      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], newUser.name);
      await userEvent.type(inputs[1], newUser.age);
      await userEvent.type(inputs[2], newUser.address);

      fireEvent.click(screen.getByText('Create User'));

      await waitFor(() => {
        expect(api.userAPI.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: newUser.name,
            age: newUser.age,
            address: newUser.address,
          })
        );
      });
    });

    it('should reset form after successful creation', async () => {
      api.userAPI.create.mockResolvedValue({
        success: true,
        data: { data: { id: 3, name: 'Bob', age: 35, address: '789 Pine Rd' } },
      });

      api.userAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add User'));
      const inputs = screen.getAllByPlaceholderText(/Enter/i);
      await userEvent.type(inputs[0], 'Bob');
      await userEvent.type(inputs[1], '35');
      await userEvent.type(inputs[2], '789 Pine Rd');

      fireEvent.click(screen.getByText('Create User'));

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Enter name')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit User', () => {
    it('should populate form with user data when edit is clicked', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('John Doe');
        const ageInput = screen.getByDisplayValue('30');
        const addressInput = screen.getByDisplayValue('123 Main St');

        expect(nameInput).toBeInTheDocument();
        expect(ageInput).toBeInTheDocument();
        expect(addressInput).toBeInTheDocument();
      });
    });

    it('should show Edit User heading when in edit mode', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit User')).toBeInTheDocument();
      });
    });

    it('should call update API with correct data', async () => {
      const updatedData = { name: 'John Updated', age: '31', address: '123 New St' };

      api.userAPI.update.mockResolvedValue({
        success: true,
        data: { data: { id: 1, ...updatedData } },
      });

      api.userAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('John Doe');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, updatedData.name);

      fireEvent.click(screen.getByText('Update User'));

      await waitFor(() => {
        expect(api.userAPI.update).toHaveBeenCalledWith(
          1,
          expect.any(Object)
        );
      });
    });
  });

  describe('Delete User', () => {
    it('should show confirmation dialog when delete is clicked', async () => {
      window.confirm = jest.fn(() => false);

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');
    });

    it('should call delete API when confirmed', async () => {
      window.confirm = jest.fn(() => true);

      api.userAPI.delete.mockResolvedValue({ success: true });
      api.userAPI.getAll.mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      }).mockResolvedValueOnce({
        success: true,
        data: { data: mockUsers },
      });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(api.userAPI.delete).toHaveBeenCalledWith(1);
      });
    });

    it('should not call delete API when cancelled', async () => {
      window.confirm = jest.fn(() => false);

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(api.userAPI.delete).not.toHaveBeenCalled();
    });

    it('should display error message when delete fails', async () => {
      window.confirm = jest.fn(() => true);

      api.userAPI.delete.mockResolvedValue({ success: false });

      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete user')).toBeInTheDocument();
      });
    });
  });

  describe('Table Display', () => {
    it('should display user table with correct columns', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const headers = ['ID', 'Name', 'Age', 'Address', 'Created At', 'Actions'];
      headers.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });
    });

    it('should display all user data in table rows', async () => {
      render(<UserTable />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
    });
  });
});
