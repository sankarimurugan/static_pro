import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MAX_ITEMS = 8;

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Error fetching items:', err));
  }, []);

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

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (items.length >= MAX_ITEMS) {
      toast.error('Only 8 items allowed');
      return;
    }

    if (!form.title || !form.description || !form.image) {
      toast.error('All fields required');
      return;
    }

    const newItem = {
      id: Date.now(),
      ...form
    };

    try {
      const savedItem = await addItem(newItem);

      // The server returns the saved item
      // We can also just append our local newItem, but better to use server response if possible
      // or just re-fetch. Here I'll append locally to be snappy.
      setItems([...items, newItem]);
      toast.success('Item added to folder');
      setForm({ title: '', description: '', image: '' });
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item to folder');
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2 className="admin-title">Admin Panel</h2>

        <form className="admin-form" onSubmit={handleAddItem}>
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

          <button
            type="submit"
            disabled={items.length >= MAX_ITEMS}
            className="add-btn"
          >
            Add Item
          </button>

          <p className="item-count">
            {items.length} / {MAX_ITEMS} items added
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
