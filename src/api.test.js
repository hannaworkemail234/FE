import { userAPI, productAPI } from './api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('uses the configured API URL and removes its trailing slash', async () => {
    const originalApiUrl = process.env.REACT_APP_API_URL;
    process.env.REACT_APP_API_URL = 'http://example.test/api/';
    jest.resetModules();

    try {
      const { userAPI: configuredUserAPI } = require('./api');
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await configuredUserAPI.getAll();

      expect(fetch).toHaveBeenCalledWith(
        'http://example.test/api/users',
        expect.objectContaining({ method: 'GET' })
      );
    } finally {
      if (originalApiUrl === undefined) {
        delete process.env.REACT_APP_API_URL;
      } else {
        process.env.REACT_APP_API_URL = originalApiUrl;
      }
      jest.resetModules();
    }
  });

  describe('User API - CRUD Operations', () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
      { id: 2, name: 'Jane Smith', age: 25, address: '456 Oak Ave' },
    ];

    describe('userAPI.getAll()', () => {
      it('should fetch all users successfully', async () => {
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: mockUsers }),
        });

        const result = await userAPI.getAll();

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/users',
          expect.objectContaining({ method: 'GET' })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(mockUsers);
        expect(result.status).toBe(200);
      });

      it('should handle fetch error gracefully', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await userAPI.getAll();

        expect(result.success).toBe(false);
        expect(result.error).toBe('Network error');
      });

      it('should handle non-ok response status', async () => {
        fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: 'Server error' }),
        });

        const result = await userAPI.getAll();

        expect(result.success).toBe(false);
        expect(result.status).toBe(500);
      });
    });

    describe('userAPI.getById()', () => {
      it('should fetch a user by ID successfully', async () => {
        const userId = 1;
        const mockUser = mockUsers[0];

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: mockUser }),
        });

        const result = await userAPI.getById(userId);

        expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/users/${userId}`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(mockUser);
      });

      it('should handle not found error (404)', async () => {
        const userId = 999;

        fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ error: 'User not found' }),
        });

        const result = await userAPI.getById(userId);

        expect(result.success).toBe(false);
        expect(result.status).toBe(404);
      });
    });

    describe('userAPI.create()', () => {
      it('should create a new user successfully', async () => {
        const newUser = { name: 'Bob Johnson', age: 35, address: '789 Pine Rd' };
        const createdUser = { id: 3, ...newUser };

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({ data: createdUser }),
        });

        const result = await userAPI.create(newUser);

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/users',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(newUser),
          })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(createdUser);
      });

      it('should handle validation error on create', async () => {
        const invalidUser = { name: '', age: -5, address: '' };

        fetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ error: 'Validation failed' }),
        });

        const result = await userAPI.create(invalidUser);

        expect(result.success).toBe(false);
        expect(result.status).toBe(400);
      });
    });

    describe('userAPI.update()', () => {
      it('should update a user successfully', async () => {
        const userId = 1;
        const updatedData = { name: 'John Updated', age: 31, address: '123 New St' };
        const updatedUser = { id: userId, ...updatedData };

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: updatedUser }),
        });

        const result = await userAPI.update(userId, updatedData);

        expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/users/${userId}`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updatedData),
          })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(updatedUser);
      });

      it('should handle update of non-existent user', async () => {
        const userId = 999;
        const updateData = { name: 'Ghost', age: 0, address: 'Nowhere' };

        fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ error: 'User not found' }),
        });

        const result = await userAPI.update(userId, updateData);

        expect(result.success).toBe(false);
        expect(result.status).toBe(404);
      });
    });

    describe('userAPI.delete()', () => {
      it('should delete a user successfully', async () => {
        const userId = 1;

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ message: 'User deleted' }),
        });

        const result = await userAPI.delete(userId);

        expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/users/${userId}`,
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result.success).toBe(true);
      });

      it('should handle delete of non-existent user', async () => {
        const userId = 999;

        fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ error: 'User not found' }),
        });

        const result = await userAPI.delete(userId);

        expect(result.success).toBe(false);
        expect(result.status).toBe(404);
      });
    });
  });

  describe('Product API - CRUD Operations', () => {
    const mockProducts = [
      { id: 1, name: 'Laptop', price: 999.99, quantity: 5 },
      { id: 2, name: 'Mouse', price: 25.99, quantity: 50 },
    ];

    describe('productAPI.getAll()', () => {
      it('should fetch all products successfully', async () => {
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: mockProducts }),
        });

        const result = await productAPI.getAll();

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/products',
          expect.objectContaining({ method: 'GET' })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(mockProducts);
      });

      it('should handle fetch error for products', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await productAPI.getAll();

        expect(result.success).toBe(false);
        expect(result.error).toBe('Network error');
      });
    });

    describe('productAPI.getById()', () => {
      it('should fetch a product by ID successfully', async () => {
        const productId = 1;
        const mockProduct = mockProducts[0];

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: mockProduct }),
        });

        const result = await productAPI.getById(productId);

        expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/products/${productId}`,
          expect.objectContaining({ method: 'GET' })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(mockProduct);
      });
    });

    describe('productAPI.create()', () => {
      it('should create a new product successfully', async () => {
        const newProduct = { name: 'Keyboard', price: 79.99, quantity: 20 };
        const createdProduct = { id: 3, ...newProduct };

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({ data: createdProduct }),
        });

        const result = await productAPI.create(newProduct);

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/products',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(newProduct),
          })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(createdProduct);
      });

      it('should handle validation error on product creation', async () => {
        const invalidProduct = { name: '', price: -10, quantity: 0 };

        fetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ error: 'Invalid product data' }),
        });

        const result = await productAPI.create(invalidProduct);

        expect(result.success).toBe(false);
        expect(result.status).toBe(400);
      });
    });

    describe('productAPI.update()', () => {
      it('should update a product successfully', async () => {
        const productId = 1;
        const updatedData = { name: 'Gaming Laptop', price: 1299.99, quantity: 3 };
        const updatedProduct = { id: productId, ...updatedData };

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: updatedProduct }),
        });

        const result = await productAPI.update(productId, updatedData);

        expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/products/${productId}`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updatedData),
          })
        );
        expect(result.success).toBe(true);
        expect(result.data.data).toEqual(updatedProduct);
      });
    });

    describe('productAPI.delete()', () => {
      it('should delete a product successfully', async () => {
        const productId = 1;

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ message: 'Product deleted' }),
        });

        const result = await productAPI.delete(productId);

        expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/products/${productId}`,
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result.success).toBe(true);
      });
    });
  });
});
