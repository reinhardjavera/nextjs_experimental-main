import React, { useState } from 'react';
import './input.css';

export interface InputProps {
  /** Type of the input field */
  type: 'text' | 'number' | 'file' | 'color' | 'email' | 'date';
  /** Placeholder text */
  placeholder?: string;
  /** Input value */
  value?: string | number;
  /** Optional change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Primary UI component for user interaction */
export const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  ...props
}: InputProps) => {
  const [color, setColor] = useState<string | undefined>(value as string);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'color') {
      setColor(event.target.value); // Update the color value
    }
    onChange?.(event); // Trigger the parent handler if provided
  };

  return (
    <div className="storybook-input-wrapper">
  {type === 'color' && (
    <label className="color-label" htmlFor="color-input">
      Pilih Warna:
    </label>
  )}
  <input
    id="color-input"
    className={['storybook-input', `storybook-input--${type}`].join(' ')}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={type === 'color' ? handleColorChange : onChange}
    {...props}
  />
  {type === 'color' && color && (
    <div
      className="color-preview"
      style={{ backgroundColor: color }}
    >
      {color}
    </div>
  )}
</div>

  );
};
