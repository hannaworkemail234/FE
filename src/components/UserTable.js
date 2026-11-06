import React, { useState, useEffect } from 'react';
import './UserTable.css';
import { userAPI } from '../api';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
  });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const result = await userAPI.getAll();
    if (result.success) {
      setUsers(result.data.data);
    } else {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
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

    if (!formData.name || !formData.age || !formData.address) {
      setError('All fields are required');
      return;
    }

    let result;
    if (editingId) {
      result = await userAPI.update(editingId, formData);
    } else {
      result = await userAPI.create(formData);
    }

    if (result.success) {
      fetchUsers();
      resetForm();
    } else {
      setError(result.data.error || 'Operation failed');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await userAPI.delete(id);
      if (result.success) {
        fetchUsers();
      } else {
        setError('Failed to delete user');
      }
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      age: user.age,
      address: user.address,
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', age: '', address: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h2>User Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter age"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-success">
              {editingId ? 'Update User' : 'Create User'}
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
        <p className="loading">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          {users.length === 0 ? (
            <p className="no-data">No users found. Create one to get started!</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.address}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
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

export default UserTable;
