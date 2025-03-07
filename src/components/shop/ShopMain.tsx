import React from 'react';
import ShopCatalogItem from './ShopCatalogItem';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import Button from '../common/Button';

const ShopMain: React.FC = () => {
  return (
    <div>
      <h2>Catalog</h2>
      <div>
        {/* Example items, replace with dynamic data later */}
        <ShopCatalogItem />
        <ShopCatalogItem />
      </div>

      <Button 
        text=""
        icon={faCartShopping}
        styleType="primary"
        className="fixed top-5 right-20 z-50"
        iconSize='text-lg'
        onClick={() => console.log('Cart button clicked')}
      />
    </div>
  );
};

export default ShopMain;