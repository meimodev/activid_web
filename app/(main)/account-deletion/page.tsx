import { Metadata } from 'next';
import { AnimatedGradientBackground } from '@/components/ui';
import AccountDeletionClient from './AccountDeletionClient';

export const metadata: Metadata = {
  title: 'Account Deletion | Activid',
  description: 'Request deletion of your Activid or Palakat account by contacting the Activid admin via WhatsApp.',
};

export default function AccountDeletionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020205] pt-32 pb-20 text-white selection:bg-indigo-500/30">
      <AnimatedGradientBackground className="fixed inset-0 -z-20 opacity-80" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(30,27,75,0.4)_0%,rgba(2,2,5,0.8)_60%,#020205_100%)]" />

      {/* Twinkling stars effect overlay */}
      <div className="fixed inset-0 -z-10 bg-[url('https://ik.imagekit.io/geb6bfhmhx/activid%20web/stars-bg.png')] opacity-20 mix-blend-screen pointer-events-none" style={{ backgroundSize: '400px' }} />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <AccountDeletionClient />
      </div>
    </main>
  );
}
