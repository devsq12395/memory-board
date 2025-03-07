import React, { useState } from 'react';

const ShopCatalogItem: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(Math.max(1, quantity - 1));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  return (
    <div className="catalog-item">
      <img src="placeholder.jpg" alt="Item Thumbnail" className="thumbnail" />
      <h3>Item Name</h3>
      <p>Item Description</p>
      <div className="quantity-control">
        <button onClick={handleDecrease}>-</button>
        <input type="number" value={quantity} onChange={handleInputChange} />
        <button onClick={handleIncrease}>+</button>
      </div>
      <button>Add to Cart</button>
    </div>
  );
};

export default ShopCatalogItem;