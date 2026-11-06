import React, { useState, useEffect } from 'react';
import './ProductTable.css';
import { productAPI } from '../api';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    const result = await productAPI.getAll();
    if (result.success) {
      setProducts(result.data.data);
    } else {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.quantity) {
      setError('All fields are required');
      return;
    }

    let result;
    if (editingId) {
      result = await productAPI.update(editingId, formData);
    } else {
      result = await productAPI.create(formData);
    }

    if (result.success) {
      fetchProducts();
      resetForm();
    } else {
      setError(result.data.error || 'Operation failed');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await productAPI.delete(id);
      if (result.success) {
        fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', price: '', quantity: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Product Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-success">
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="table-wrapper">
          {products.length === 0 ? (
            <p className="no-data">No products found. Create one to get started!</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductTable;
