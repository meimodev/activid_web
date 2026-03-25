'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { siteContent } from '@/lib/site-content';
import { trackContact } from '@/lib/analytics';

type AccountApp = 'activid' | 'palakat';

type AccountOption = {
  id: AccountApp;
  label: string;
  description: string;
  preparation: string[];
  impact: string[];
};

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    id: 'activid',
    label: 'Activid account',
    description: 'Use this option if you want to remove access to your Activid web account and the personal data attached to it.',
    preparation: [
      'Registered full name',
      'Email or WhatsApp number used during account creation',
      'Additional information to help verify account ownership',
    ],
    impact: [
      'Access to your Activid account will be revoked once the process is complete',
      'Profile and account-related data will be reviewed for deletion according to operational and legal requirements',
      'The admin may contact you if further verification is needed',
    ],
  },
  {
    id: 'palakat',
    label: 'Palakat account',
    description: 'Use this option if you want to request deletion of your Palakat mobile-app account and the related user data.',
    preparation: [
      'Full name registered on Palakat',
      'Email, phone number, or username connected to the Palakat account',
      'Brief details so the admin can locate your account quickly',
    ],
    impact: [
      'Access to the Palakat account will be revoked after the request is processed',
      'Account data and related usage data will be reviewed for deletion according to applicable policies',
      'The admin may request additional details if the account identity is unclear',
    ],
  },
];

function getWhatsappNumber() {
  const rawValue = siteContent.contactPage.methods.whatsapp.value || siteContent.contactPage.methods.whatsapp.href;
  return rawValue.replace(/\D/g, '');
}

function createDeletionMessage(option: AccountOption) {
  return [
    'Hello Activid admin,',
    '',
    `I would like to request the deletion of my ${option.label}.`,
    '',
    'Here are my details:',
    '- Full name: ',
    '- Registered email / number: ',
    '- Additional account details (if any): ',
    '',
    'Please let me know the verification steps and the estimated processing time.',
    '',
    'Thank you.',
  ].join('\n');
}

const revealEase = [0.16, 1, 0.3, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: revealEase } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export default function AccountDeletionClient() {
  const [selectedApp, setSelectedApp] = useState<AccountApp>('activid');

  const selectedOption = ACCOUNT_OPTIONS.find((option) => option.id === selectedApp) ?? ACCOUNT_OPTIONS[0];

  const whatsappUrl = useMemo(() => {
    const whatsappNumber = getWhatsappNumber();
    const message = createDeletionMessage(selectedOption);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [selectedOption]);

  return (
    <>
      {/* Deep Space Animated Nebulas */}
      <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden">
        {/* Core nebulas */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen"
        />
        {/* Additional galaxy dust layers */}
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen"
        />
        {/* Moving comet/light streak */}
        <motion.div
          animate={{ 
            x: ['-100vw', '200vw'],
            y: ['-50vh', '100vh'],
            opacity: [0, 1, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatDelay: 5,
            ease: "linear" 
          }}
          className="absolute top-[20%] left-0 w-[200px] h-[2px] bg-linear-to-r from-transparent via-indigo-300 to-transparent blur-[1px] rotate-45"
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-12"
      >
        {/* Header Section */}
        <motion.div variants={revealVariants} className="mb-2 max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300 backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            Account Management
          </span>
          <h1 className="mt-6 text-4xl font-black font-sans tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem] leading-tight">
            Request <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Account Deletion</span> securely.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-indigo-100/70 sm:text-lg">
            Use this page to request deletion for either your Activid account or your Palakat account. Select the app,
            review the process, and send your request straight to the official Activid admin team via WhatsApp.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] relative z-10">
          <motion.section variants={revealVariants} className="rounded-[2rem] border border-indigo-500/20 bg-[#060818]/60 p-6 shadow-[0_0_40px_rgba(79,70,229,0.15)] backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">Choose your app</p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Which account would you like to delete?</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-2">
                {ACCOUNT_OPTIONS.map((option) => {
                  const isActive = option.id === selectedApp;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedApp(option.id)}
                      className={`group relative rounded-[1.5rem] border px-5 py-5 text-left transition-all duration-500 overflow-hidden ${
                        isActive 
                          ? 'border-indigo-400 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.25)] scale-[1.02]' 
                          : 'border-white/5 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:scale-[1.01]'
                      }`}
                      aria-pressed={isActive}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeAppGlow"
                          className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent" 
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div>
                          <h3 className={`text-lg font-semibold transition-colors duration-300 ${isActive ? 'text-indigo-100' : 'text-white group-hover:text-indigo-200'}`}>
                            {option.label}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-indigo-100/60">{option.description}</p>
                        </div>
                        <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                          isActive ? 'border-indigo-400 bg-indigo-400/20' : 'border-white/20 bg-transparent group-hover:border-indigo-400/50'
                        }`}>
                          {isActive && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,1)]" 
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-[1.5rem] border border-indigo-500/10 bg-indigo-950/20 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <h3 className="text-lg font-semibold text-indigo-100 relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Before you send
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-indigo-100/70 relative z-10">
                  <AnimatePresence mode="popLayout">
                    {selectedOption.preparation.map((item, i) => (
                      <motion.li 
                        key={`${selectedOption.id}-prep-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex gap-3"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-purple-500/10 bg-purple-950/20 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <h3 className="text-lg font-semibold text-purple-100 relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  What happens next
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-purple-100/70 relative z-10">
                  <AnimatePresence mode="popLayout">
                    {selectedOption.impact.map((item, i) => (
                      <motion.li 
                        key={`${selectedOption.id}-impact-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex gap-3"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.aside variants={revealVariants} className="rounded-[2rem] border border-indigo-500/20 bg-[linear-gradient(180deg,rgba(6,8,24,0.7)_0%,rgba(15,23,42,0.8)_100%)] p-6 shadow-[0_0_40px_rgba(79,70,229,0.15)] backdrop-blur-2xl sm:p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
            
            <div className="inline-flex w-fit items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              Direct admin request
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">Send the deletion request to Activid admin</h2>
            <p className="mt-4 text-sm leading-7 text-indigo-100/70 sm:text-base">
              The button below opens WhatsApp directly to the official Activid admin number with a prefilled request for your selected app.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact.whatsappClick()}
              className="mt-10 group relative inline-flex w-full items-center justify-center rounded-full bg-indigo-500 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Request deletion
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-full border border-white/20" />
            </a>
          </motion.aside>
        </div>
      </motion.div>
    </>
  );
}
