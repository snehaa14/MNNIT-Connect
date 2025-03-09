// Button.js
import React from 'react';

const BlueButton = ({ onClick, label, type = "button", className }) => {
  return (
    <button type={type} onClick={onClick} className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold  ${className}`} > {label} </button>
  );
};

export default BlueButton;
