'use client';

import { motion } from 'framer-motion';
import { useState, InputHTMLAttributes } from 'react';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  className?: string;
}

/**
 * FormField component with animated border and label on focus
 * Requirement 4.3: Form fields should animate border and label with smooth transitions
 */
export function FormField({
  label,
  error,
  className = '',
  ...inputProps
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    inputProps.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    inputProps.onChange?.(e);
  };

  const isLabelFloating = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative"
        initial={false}
      >
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            borderWidth: isFocused ? 2 : 1,
            borderColor: error
              ? '#ef4444'
              : isFocused
              ? '#3b82f6'
              : '#d1d5db',
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
          style={{
            borderStyle: 'solid',
          }}
        />

        {/* Input field */}
        <input
          {...inputProps}
          className="w-full px-4 py-3 bg-transparent relative z-10 outline-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        {/* Animated label */}
        <motion.label
          className="absolute left-4 pointer-events-none origin-left"
          animate={{
            y: isLabelFloating ? -28 : 12,
            scale: isLabelFloating ? 0.85 : 1,
            color: error
              ? '#ef4444'
              : isFocused
              ? '#3b82f6'
              : '#6b7280',
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        >
          {label}
        </motion.label>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-red-500 text-sm mt-1 ml-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
