'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useScrollProgress } from '@/hooks';
import { EASING, DURATION } from '@/lib/animation-config';
import { trackNavigation } from '@/lib/analytics';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
  hideUntilScroll?: boolean;
  isGlobal?: boolean;
  position?: 'fixed' | 'sticky';
}

const defaultItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#services' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Navigation component with animated menu and scroll progress indicator.
 * Features:
 * - Stagger animation for menu items (0.1s intervals)
 * - Reverse stagger on close
 * - Scroll progress indicator
 * - Smooth opacity and position transitions
 */
export default function Navigation({
  items = defaultItems,
  className,
  hideUntilScroll = false,
  isGlobal = false,
  position = 'fixed'
}: NavigationProps) {
  const pathname = usePathname();
  // If this is the global navigation and we are on the home page, do not render
  // because the home page has its own specific navigation instance.
  const shouldRender = !isGlobal || pathname !== '/';

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(!hideUntilScroll);
  const { scrollY } = useScroll();
  const scrollProgress = useScrollProgress();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideUntilScroll) {
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      // Show navigation when scrolled past 80% of the viewport height
      if (latest > viewportHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  });

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  // Drawer variants
  const drawerVariants = {
    closed: {
      x: '100%',
      transition: {
        duration: DURATION.normal,
        ease: EASING.easeInOutQuint,
      },
    },
    open: {
      x: 0,
      transition: {
        duration: DURATION.normal,
        ease: EASING.easeOutExpo,
      },
    },
  };

  // Container variants for stagger animation
  const menuContainerVariants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  // Menu item variants with opacity and position transitions
  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: 20,
      transition: {
        duration: DURATION.fast,
        ease: EASING.easeInOutQuint,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: DURATION.fast,
        ease: EASING.easeOutExpo,
      },
    },
  };

  return (
    <motion.nav
      className={`${position} top-0 left-0 right-0 z-50 ${className || ''}`}
      role="navigation"
      aria-label="Main navigation"
      initial={hideUntilScroll ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Navigation header */}
      <div className="flex items-center justify-between p-4 bg-[#F8EFDE]/70 backdrop-blur-md border-b border-[#1a1a3e]/10 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[#1a1a3e] focus:outline-none focus:ring-2 focus:ring-[#3d2645] focus:ring-offset-2 rounded font-sans"
          aria-label="Activid Portfolio - Home"
          onClick={() => trackNavigation.logoClick()}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            className="relative w-8 h-8"
          >
            <Image
              src="https://ik.imagekit.io/geb6bfhmhx/activid%20web/0_LOGO_WHITE.PNG"
              alt="Activid Logo"
              fill
              className="object-contain invert"
            />
          </motion.div>
          <div className="flex items-center">
            {"Activid".split('').map((char, i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0, 1, 1] }}
                transition={{
                  duration: 2,
                  times: [0, 0.2, 1],
                  repeat: Infinity,
                  repeatDelay: 5,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </Link>

        {/* Menu icon button */}
        <button
          onClick={() => {
            const newState = !isOpen;
            setIsOpen(newState);
            trackNavigation.mobileMenuToggle(newState);
          }}
          className="p-2 text-[#1a1a3e] hover:bg-[#1a1a3e]/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3d2645] focus:ring-offset-2"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="drawer-menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Side drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="drawer-menu"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#F8EFDE] shadow-2xl z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a3e]/10">
              <h2 className="text-xl font-bold text-[#1a1a3e] font-sans">
                Menu
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#1a1a3e] hover:bg-[#1a1a3e]/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3d2645] focus:ring-offset-2"
                aria-label="Close navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer content */}
            <motion.ul
              variants={menuContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col gap-2 p-6"
            >
              {items.map((item, index) => (
                <motion.li key={index} variants={menuItemVariants} role="none">
                  <Link
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      trackNavigation.linkClick(item.label, item.href);
                    }}
                    className="block px-4 py-3 text-lg font-medium text-[#1a1a3e] hover:bg-[#1a1a3e]/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3d2645] focus:ring-offset-2 font-sans"
                    role="menuitem"
                    tabIndex={0}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
