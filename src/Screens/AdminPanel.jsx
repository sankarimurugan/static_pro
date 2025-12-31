import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addItem, getItems, updateItem, deleteItem } from '../Services/itemService';

const MAX_ITEMS = 8;

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    getItems()
      .then((data) => setItems(data))
      .catch((err) => console.error('Error fetching items:', err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && items.length >= MAX_ITEMS) {
      toast.error('Only 8 items allowed');
      return;
    }

    if (!form.title || !form.description || !form.image) {
      toast.error('All fields required');
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        // Update existing item
        await updateItem(editingId, form);
        toast.success('Item updated successfully');
        setEditingId(null);
      } else {
        // Add new item
        // Use a temporary ID for local optimistic update, but don't include it in Firestore data if possible
        // Firestore will generate its own ID if we use addDoc without ID, or we can use a string timestamp
        const newItem = {
           // No 'id' here, let addDoc generate it or handle inside addItem
           ...form
        };
        await addItem(newItem);
        toast.success('Item added successfully');
      }
      
      setForm({ title: '', description: '', image: '' });
      fetchItems(); // Refresh list from server
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    setLoading(true);
    try {
      await deleteItem(id);
      toast.success('Item deleted successfully');
      
      // If we deleted the item being edited, clear the form
      if (editingId === id) {
        setEditingId(null);
        setForm({ title: '', description: '', image: '' });
      }
      
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', image: '' });
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2 className="admin-title">Admin Panel</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {form.image && (
            <div className="image-preview">
              <img src={form.image} alt="preview" />
            </div>
          )}

          <div className="button-group">
            <button
              type="submit"
              disabled={loading || (!editingId && items.length >= MAX_ITEMS)}
              className="add-btn"
            >
              {loading ? 'Processing...' : (editingId ? 'Update Item' : 'Add Item')}
            </button>
            
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="cancel-btn" style={{marginLeft: '10px', backgroundColor: '#666'}}>
                Cancel
              </button>
            )}
          </div>

          <p className="item-count">
            {items.length} / {MAX_ITEMS} items added
          </p>
        </form>
      </div>

      <div className="admin-list">
        <h3>Current Items</h3>
        {items.map(item => (
          <div key={item.id} className="admin-item-card">
            <img src={item.image} alt={item.title} />
            <div className="admin-item-info">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div className="actions">
              <button 
                onClick={() => handleEdit(item)}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p style={{color: '#999', textAlign: 'center', marginTop: '20px'}}>No items added yet.</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
