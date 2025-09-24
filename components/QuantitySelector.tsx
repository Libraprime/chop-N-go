'use client';

import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (newQuantity: number) => void;
  disabled: boolean;
}

const QuantitySelector = ({ quantity, setQuantity, disabled }: QuantitySelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="btn btn-sm btn-square"
        disabled={disabled || quantity <= 1}
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
        className="w-16 text-center border rounded-md p-1"
        min="1"
        disabled={disabled}
      />
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="btn btn-sm btn-square"
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
