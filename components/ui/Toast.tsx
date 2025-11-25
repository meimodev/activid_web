'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * Toast notification component with spring physics animation
 * Requirement 4.4: Toast notifications should use spring physics and auto-dismiss
 */
export function Toast({
  message,
  type = 'info',
  duration = 3000,
  isVisible,
  onClose,
  position = 'top-right',
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positionClasses[position]} z-50 px-6 py-4 rounded-lg shadow-lg ${typeStyles[type]} min-w-[300px] max-w-[500px]`}
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 },
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
