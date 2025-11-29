
import React, { useState, useEffect } from 'react';

interface Props {
  value: number | undefined;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<Props> = ({ value, onChange, className, placeholder, disabled }) => {
  const [inputValue, setInputValue] = useState(value !== undefined ? value.toString() : '');

  useEffect(() => {
    const parsedLocal = parseFloat(inputValue.replace(',', '.'));
    
    // Ignore sync if local is incomplete/NaN and prop is 0 (allows clearing input or typing ".")
    if (isNaN(parsedLocal) && (value === 0 || value === undefined)) return;
    
    // Sync only if there is a real semantic difference to avoid cursor jumps
    if (value !== parsedLocal) {
        setInputValue(value?.toString() ?? '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Allow digits and max one dot or comma
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    
    if (regex.test(val)) {
        setInputValue(val);
        
        if (val === '' || val === '.' || val === ',') {
            onChange(0);
        } else {
            const parsed = parseFloat(val.replace(',', '.'));
            if (!isNaN(parsed)) {
                onChange(parsed);
            }
        }
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      value={inputValue}
      onChange={handleChange}
      onBlur={() => {
          if (value !== undefined) setInputValue(value.toString());
      }}
    />
  );
};
