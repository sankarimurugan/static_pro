import React, { useState, useEffect } from 'react';
import { getItems } from '../Services/itemService';

const UserPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems()
      .then((data) => setItems(data))
      .catch((err) => console.error('Error fetching items:', err));
  }, []);

  return (
    <div className="user-page">
      <h1 className="user-title">Our Products</h1>

      <div className="items-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <img
              src={item.image}
              alt={item.title}
              className="item-image"
            />

            <div className="item-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
