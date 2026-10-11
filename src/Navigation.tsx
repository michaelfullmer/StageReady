import React from 'react';
import { Mic, MapPin, History } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: 'coach' | 'gigs' | 'history';
  onTabChange: (tab: 'coach' | 'gigs' | 'history') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-brand-black/95 backdrop-blur-lg border-t border-brand-grey px-6 py-4 flex justify-between items-center z-50">
      <NavButton 
        active={activeTab === 'coach'} 
        onClick={() => onTabChange('coach')}
        icon={<Mic className="w-6 h-6" />}
        label="Coach"
      />
      <NavButton 
        active={activeTab === 'gigs'} 
        onClick={() => onTabChange('gigs')}
        icon={<MapPin className="w-6 h-6" />}
        label="Gigs"
      />
      <NavButton 
        active={activeTab === 'history'} 
        onClick={() => onTabChange('history')}
        icon={<History className="w-6 h-6" />}
        label="History"
      />
    </nav>
  );
}

function NavButton({ active, onClick, icon, label }: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
        active ? 'text-brand-teal scale-110' : 'text-brand-light-grey hover:text-white'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-brand-teal rounded-full mt-0.5" 
        />
      )}
    </button>
  );
}
