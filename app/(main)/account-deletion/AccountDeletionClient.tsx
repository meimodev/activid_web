'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { siteContent } from '@/lib/site-content';
import { trackContact } from '@/lib/analytics';

type AccountApp = 'activid' | 'palakat' | 'loit';

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
  {
    id: 'loit',
    label: 'Loit account',
    description: 'Use this option if you want to request deletion of your Loit mobile-app account and the related user data.',
    preparation: [
      'Full name registered on Loit',
      'Email, phone number, or username connected to the Loit account',
      'Brief details so the admin can locate your account quickly',
    ],
    impact: [
      'Access to the Loit account will be revoked after the request is processed',
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
  const label = option.id === 'loit' ? 'LOIT account' : option.label;
  return [
    'Hello Activid admin,',
    '',
    `I would like to request the deletion of my ${label}.`,
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

type AppTheme = {
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  headingGradient: string;
  cardStyle: string;
  cardPrepBg: string;
  textPrep: string;
  accentTextPrep: string;
  bulletPrep: string;
  cardImpactBg: string;
  textImpact: string;
  accentTextImpact: string;
  bulletImpact: string;
  asideStyle: string;
  topLineGlow: string;
  asideBadgeStyle: string;
  asideTitle: string;
  asideDescription: string;
  buttonClass: string;
  badgeLabel: string;
  title: string;
  description: string;
  nebulas: {
    color1: string;
    color2: string;
    color3: string;
    color4: string;
    cometColor: string;
  };
};

const THEMES: Record<AccountApp, AppTheme> = {
  activid: {
    accentText: 'text-indigo-300',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/30',
    accentGlow: 'shadow-[0_0_20px_rgba(79,70,229,0.25)]',
    headingGradient: 'from-indigo-400 via-purple-400 to-indigo-400',
    cardStyle: 'border-indigo-500/20 bg-[#060818]/60 shadow-[0_0_40px_rgba(79,70,229,0.15)]',
    cardPrepBg: 'border-indigo-500/10 bg-indigo-950/20',
    textPrep: 'text-indigo-100',
    accentTextPrep: 'text-indigo-400',
    bulletPrep: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]',
    cardImpactBg: 'border-purple-500/10 bg-purple-950/20',
    textImpact: 'text-purple-100',
    accentTextImpact: 'text-purple-400',
    bulletImpact: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    asideStyle: 'border-indigo-500/20 bg-[linear-gradient(180deg,rgba(6,8,24,0.7)_0%,rgba(15,23,42,0.8)_100%)] shadow-[0_0_40px_rgba(79,70,229,0.15)]',
    topLineGlow: 'bg-linear-to-r from-transparent via-indigo-500/50 to-transparent',
    asideBadgeStyle: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]',
    asideTitle: 'Send the deletion request to Activid admin',
    asideDescription: 'The button below opens WhatsApp directly to the official Activid admin number with a prefilled request for your Activid account.',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]',
    badgeLabel: 'Activid Platform Deletion',
    title: 'Activid Account',
    description: 'Use this page to request deletion for your Activid account. Select the app, review the process, and send your request straight to the official Activid admin team via WhatsApp.',
    nebulas: {
      color1: 'bg-indigo-600/20',
      color2: 'bg-purple-600/20',
      color3: 'bg-blue-600/10',
      color4: 'bg-fuchsia-600/10',
      cometColor: 'via-indigo-300',
    }
  },
  palakat: {
    accentText: 'text-teal-300',
    accentBg: 'bg-teal-500/10',
    accentBorder: 'border-teal-500/30',
    accentGlow: 'shadow-[0_0_20px_rgba(20,184,166,0.25)]',
    headingGradient: 'from-teal-400 via-cyan-400 to-emerald-400',
    cardStyle: 'border-teal-500/20 bg-[#031c1c]/60 shadow-[0_0_40px_rgba(20,184,166,0.15)]',
    cardPrepBg: 'border-teal-500/10 bg-teal-950/20',
    textPrep: 'text-teal-100',
    accentTextPrep: 'text-teal-400',
    bulletPrep: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]',
    cardImpactBg: 'border-cyan-500/10 bg-cyan-950/20',
    textImpact: 'text-cyan-100',
    accentTextImpact: 'text-cyan-400',
    bulletImpact: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    asideStyle: 'border-teal-500/20 bg-[linear-gradient(180deg,rgba(3,28,28,0.7)_0%,rgba(15,23,42,0.8)_100%)] shadow-[0_0_40px_rgba(20,184,166,0.15)]',
    topLineGlow: 'bg-linear-to-r from-transparent via-teal-500/50 to-transparent',
    asideBadgeStyle: 'border-teal-400/30 bg-teal-500/10 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]',
    asideTitle: 'Send deletion request to Activid support',
    asideDescription: 'The button below opens WhatsApp directly to the official Activid support desk to request deletion of your Palakat account.',
    buttonClass: 'bg-teal-600 hover:bg-teal-500 hover:shadow-[0_0_30px_rgba(20,184,166,0.6)]',
    badgeLabel: 'Palakat App Deletion • Published by Activid',
    title: 'Palakat Account',
    description: 'This is the official account deletion request page for Palakat, a mobile application developed and published by Activid. Use this secure form to request the deletion of your account and associated user data.',
    nebulas: {
      color1: 'bg-teal-600/20',
      color2: 'bg-cyan-600/20',
      color3: 'bg-emerald-600/10',
      color4: 'bg-sky-600/10',
      cometColor: 'via-teal-300',
    }
  },
  loit: {
    accentText: 'text-emerald-300',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    accentGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    headingGradient: 'from-emerald-400 via-green-400 to-lime-400',
    cardStyle: 'border-emerald-500/20 bg-[#021810]/60 shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    cardPrepBg: 'border-emerald-500/10 bg-emerald-950/20',
    textPrep: 'text-emerald-100',
    accentTextPrep: 'text-emerald-400',
    bulletPrep: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    cardImpactBg: 'border-lime-500/10 bg-lime-950/20',
    textImpact: 'text-lime-100',
    accentTextImpact: 'text-lime-400',
    bulletImpact: 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]',
    asideStyle: 'border-emerald-500/20 bg-[linear-gradient(180deg,rgba(2,24,16,0.7)_0%,rgba(15,23,42,0.8)_100%)] shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    topLineGlow: 'bg-linear-to-r from-transparent via-emerald-500/50 to-transparent',
    asideBadgeStyle: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    asideTitle: 'Send deletion request to Activid support',
    asideDescription: 'The button below opens WhatsApp directly to the official Activid support desk to request deletion of your LOIT — Shareable Finance Tracker account.',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]',
    badgeLabel: 'LOIT App Deletion • Published by Activid',
    title: 'LOIT — Shareable Finance Tracker',
    description: 'This is the official account deletion request page for LOIT — Shareable Finance Tracker, a mobile application developed and published by Activid. Use this secure form to request the deletion of your account and associated personal data.',
    nebulas: {
      color1: 'bg-emerald-600/20',
      color2: 'bg-green-600/20',
      color3: 'bg-lime-600/10',
      color4: 'bg-teal-600/10',
      cometColor: 'via-emerald-300',
    }
  }
};

export default function AccountDeletionClient() {
  const searchParams = useSearchParams();
  const appParam = searchParams.get('app')?.toLowerCase();
  
  const isExclusiveMode = appParam === 'activid' || appParam === 'palakat' || appParam === 'loit';
  
  const [selectedApp, setSelectedApp] = useState<AccountApp>('activid');
  
  const activeApp: AccountApp = isExclusiveMode ? (appParam as AccountApp) : selectedApp;
  
  const activeTheme = THEMES[activeApp];
  const selectedOption = ACCOUNT_OPTIONS.find((option) => option.id === activeApp) ?? ACCOUNT_OPTIONS[0];

  const whatsappUrl = useMemo(() => {
    const whatsappNumber = getWhatsappNumber();
    const message = createDeletionMessage(selectedOption);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [selectedOption]);

  useEffect(() => {
    if (isExclusiveMode) {
      const appName = activeApp === 'loit' ? 'LOIT — Shareable Finance Tracker' : activeApp === 'palakat' ? 'Palakat' : 'Activid';
      document.title = `${appName} Account Deletion | Activid`;
    } else {
      document.title = 'Account Deletion | Activid';
    }
  }, [isExclusiveMode, activeApp]);

  return (
    <>
      {/* Deep Space Animated Nebulas */}
      <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden">
        {/* Core nebulas */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] right-[-10%] w-[600px] h-[600px] ${activeTheme.nebulas.color1} rounded-full blur-[120px] mix-blend-screen`}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] ${activeTheme.nebulas.color2} rounded-full blur-[100px] mix-blend-screen`}
        />
        {/* Additional galaxy dust layers */}
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute top-[40%] left-[20%] w-[400px] h-[400px] ${activeTheme.nebulas.color3} rounded-full blur-[150px] mix-blend-screen`}
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className={`absolute bottom-[20%] right-[10%] w-[700px] h-[700px] ${activeTheme.nebulas.color4} rounded-full blur-[150px] mix-blend-screen`}
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
          className={`absolute top-[20%] left-0 w-[200px] h-[2px] bg-linear-to-r from-transparent ${activeTheme.nebulas.cometColor} to-transparent blur-[1px] rotate-45`}
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
          <span className={`inline-flex items-center rounded-full border ${activeTheme.accentBorder} ${activeTheme.accentBg} px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${activeTheme.accentText} backdrop-blur-md ${activeTheme.accentGlow}`}>
            {isExclusiveMode ? activeTheme.badgeLabel : 'Account Management'}
          </span>
          <h1 className="mt-6 text-4xl font-black font-sans tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem] leading-tight">
            Request <span className={`bg-linear-to-r ${activeTheme.headingGradient} bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]`}>{activeTheme.title}</span> securely.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-indigo-100/70 sm:text-lg">
            {activeTheme.description}
          </p>
        </motion.div>

        {isExclusiveMode && (
          <motion.div 
            variants={revealVariants}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border ${activeTheme.accentBorder} ${activeTheme.accentBg} px-6 py-4 backdrop-blur-md ${activeTheme.accentGlow}`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-5 h-5 ${activeTheme.accentText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-indigo-100/90">
                You are requesting account deletion specifically for <strong className="text-white capitalize">{activeApp === 'loit' ? 'LOIT' : activeApp}</strong>.
              </p>
            </div>
            <Link
              href="/account-deletion"
              className={`text-xs font-bold uppercase tracking-wider ${activeTheme.accentText} hover:underline underline-offset-4 transition-all duration-300`}
            >
              {"← Delete another app's account"}
            </Link>
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] relative z-10">
          <motion.section variants={revealVariants} className={`rounded-[2rem] border ${activeTheme.cardStyle} p-6 backdrop-blur-2xl sm:p-8`}>
            {!isExclusiveMode && (
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${activeTheme.accentText}`}>Choose your app</p>
                  <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Which account would you like to delete?</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mt-2">
                  {ACCOUNT_OPTIONS.map((option) => {
                    const isActive = option.id === selectedApp;
                    const optionTheme = THEMES[option.id];
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedApp(option.id)}
                        className={`group relative rounded-[1.5rem] border px-4 py-5 text-left transition-all duration-500 overflow-hidden ${
                          isActive 
                            ? `${optionTheme.accentBorder} ${optionTheme.accentBg} ${optionTheme.accentGlow} scale-[1.02]` 
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:scale-[1.01]'
                        }`}
                        aria-pressed={isActive}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="activeAppGlow"
                            className={`absolute inset-0 bg-linear-to-br ${option.id === 'activid' ? 'from-indigo-500/20' : option.id === 'palakat' ? 'from-teal-500/20' : 'from-emerald-500/20'} to-transparent`} 
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                          <div>
                            <h3 className={`text-lg font-bold transition-colors duration-300 ${isActive ? optionTheme.accentText : 'text-white group-hover:text-indigo-200'}`}>
                              {option.id === 'loit' ? 'LOIT account' : option.label}
                            </h3>
                            <p className="mt-2 text-xs leading-6 text-indigo-100/60">{option.description}</p>
                          </div>
                          <div className="flex justify-end mt-4">
                            <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                              isActive ? `${optionTheme.accentBorder} bg-white/10` : 'border-white/20 bg-transparent'
                            }`}>
                              {isActive && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`h-2 w-2 rounded-full ${option.id === 'activid' ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,1)]' : option.id === 'palakat' ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,1)]' : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]'}`} 
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-6 xl:grid-cols-2">
              <div className={`rounded-[1.5rem] border ${activeTheme.cardPrepBg} p-6 relative overflow-hidden group`}>
                <div className={`absolute inset-0 bg-linear-to-br ${activeApp === 'activid' ? 'from-indigo-500/5' : activeApp === 'palakat' ? 'from-teal-500/5' : 'from-emerald-500/5'} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <h3 className={`text-lg font-semibold ${activeTheme.textPrep} relative z-10 flex items-center gap-2`}>
                  <svg className={`w-5 h-5 ${activeTheme.accentTextPrep}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${activeTheme.bulletPrep}`} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div className={`rounded-[1.5rem] border ${activeTheme.cardImpactBg} p-6 relative overflow-hidden group`}>
                <div className={`absolute inset-0 bg-linear-to-br ${activeApp === 'activid' ? 'from-purple-500/5' : activeApp === 'palakat' ? 'from-cyan-500/5' : 'from-lime-500/5'} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <h3 className={`text-lg font-semibold ${activeTheme.textImpact} relative z-10 flex items-center gap-2`}>
                  <svg className={`w-5 h-5 ${activeTheme.accentTextImpact}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  What happens next
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-indigo-100/70 relative z-10">
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
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${activeTheme.bulletImpact}`} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.aside variants={revealVariants} className={`rounded-[2rem] border ${activeTheme.asideStyle} p-6 backdrop-blur-2xl sm:p-8 flex flex-col justify-center relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${activeTheme.topLineGlow} opacity-50`} />
            
            <div className={`inline-flex w-fit items-center rounded-full border ${activeTheme.asideBadgeStyle} px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]`}>
              Direct admin request
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">{activeTheme.asideTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-indigo-100/70 sm:text-base">
              {activeTheme.asideDescription}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact.whatsappClick()}
              className={`mt-10 group relative inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 ${activeTheme.buttonClass} hover:-translate-y-1`}
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
