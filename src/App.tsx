import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import VocalCoach from './VocalCoach';
import GigFinder from './GigFinder';
import History from './History';
import Navigation from './Navigation';

type Tab = 'coach' | 'gigs' | 'history';

const tabVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0
  })
};

const tabOrder: Tab[] = ['coach', 'gigs', 'history'];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('coach');
  const [direction, setDirection] = useState(0);

  const handleTabChange = (newTab: Tab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  return (
    <div className="flex-1 flex flex-col relative pb-20">
      {/* Logo Header */}
      <div className="p-4 flex justify-center bg-brand-black/50 backdrop-blur-sm sticky top-0 z-20">
        <img 
          src="https://i.imgur.com/dzZyFUC.png" 
          alt="StageReady Logo" 
          className="h-10 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Content with Animations */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col w-full"
          >
            {activeTab === 'coach' && <VocalCoach />}
            {activeTab === 'gigs' && <GigFinder />}
            {activeTab === 'history' && <History />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
