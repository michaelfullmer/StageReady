import React, { useState, useEffect } from 'react';
import { MapPin, Search, Star, StarOff, Calendar, Mic, Radio, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Gig, GigType } from './types';
import { getMockGigs } from './mockData';
import { loadState, updateCity, toggleGigInterest } from './storage';

export default function GigFinder() {
  const [city, setCity] = useState('');
  const [isCitySet, setIsCitySet] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filter, setFilter] = useState<GigType | 'All' | 'Saved'>('All');
  const [interestedIds, setInterestedIds] = useState<string[]>([]);

  useEffect(() => {
    const state = loadState();
    if (state.city) {
      setCity(state.city);
      setIsCitySet(true);
      setGigs(getMockGigs(state.city));
    }
    setInterestedIds(state.interestedGigs);
  }, []);

  const handleSetCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      updateCity(city.trim());
      setIsCitySet(true);
      setGigs(getMockGigs(city.trim()));
    }
  };

  const handleToggleInterest = (id: string) => {
    toggleGigInterest(id);
    setInterestedIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const filteredGigs = gigs.filter(g => {
    if (filter === 'All') return true;
    if (filter === 'Saved') return interestedIds.includes(g.id);
    return g.type === filter;
  });

  const getGigIcon = (type: GigType) => {
    switch (type) {
      case 'Open Mic': return <Mic className="w-6 h-6 text-brand-teal" />;
      case 'Live Set': return <Radio className="w-6 h-6 text-brand-teal" />;
      case 'Audition': return <Star className="w-6 h-6 text-brand-teal" />;
      default: return <Award className="w-6 h-6 text-brand-teal" />;
    }
  };

  if (!isCitySet) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-brand-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-brand-teal" />
            </div>
            <h1 className="text-3xl font-bold">Gig Finder</h1>
            <p className="text-brand-light-grey">Enter your city to find local opportunities</p>
          </div>
          
          <form onSubmit={handleSetCity} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light-grey w-5 h-5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Nashville, TN"
                className="w-full bg-brand-grey border border-brand-light-grey/30 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-teal transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-teal text-brand-black font-bold py-4 rounded-xl hover:bg-white transition-colors"
            >
              Find Gigs
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden safe-bottom">
      <header className="p-6 bg-brand-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-brand-grey">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-teal" />
            <h2 className="text-xl font-bold">{city}</h2>
          </div>
          <button 
            onClick={() => setIsCitySet(false)}
            className="text-xs text-brand-teal font-bold uppercase tracking-wider"
          >
            Change City
          </button>
        </div>

        <div className="flex gap-2 items-center overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setFilter('Saved')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full shrink-0 transition-colors ${
              filter === 'Saved' 
                ? 'bg-brand-teal text-brand-black' 
                : 'bg-brand-teal/10 border border-brand-teal/20 text-brand-teal'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filter === 'Saved' ? 'fill-brand-black' : 'fill-brand-teal'}`} />
            <span className="text-xs font-black">{interestedIds.length} Saved</span>
          </button>
          
          <div className="w-px h-6 bg-brand-grey shrink-0 mx-1" />

          {['All', 'Open Mic', 'Live Set', 'Audition'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                filter === t 
                  ? 'bg-brand-teal text-brand-black' 
                  : 'bg-brand-grey text-brand-light-grey border border-brand-light-grey/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredGigs.map((gig) => (
            <motion.div
              key={gig.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-grey/40 border border-brand-grey rounded-2xl p-4 flex gap-4"
            >
              <div className="w-12 h-12 bg-brand-black rounded-xl flex items-center justify-center shrink-0">
                {getGigIcon(gig.type)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight">{gig.venue}</h3>
                  <button 
                    onClick={() => handleToggleInterest(gig.id)}
                    className="p-1"
                  >
                    {interestedIds.includes(gig.id) ? (
                      <Star className="w-6 h-6 text-brand-teal fill-current" />
                    ) : (
                      <StarOff className="w-6 h-6 text-brand-light-grey" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-tighter">
                  <span className="text-brand-teal">{gig.type}</span>
                  <span className="text-brand-light-grey flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {gig.date}
                  </span>
                </div>
                
                <p className="text-sm text-brand-light-grey line-clamp-2">
                  {gig.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredGigs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-brand-grey/20 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-brand-grey" />
            </div>
            <p className="text-brand-light-grey max-w-[200px]">
              {filter === 'Saved' 
                ? "No saved gigs yet. Star a listing to save it here."
                : `No ${filter.toLowerCase()}s found in ${city}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
