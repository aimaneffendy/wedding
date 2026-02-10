"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MainContent from './main';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSubmittedRsvp, setHasSubmittedRsvp] = useState(false);

  const fetchData = async () => {
  const { data: wishData } = await supabase.from('wishes').select('*').order('created_at', { ascending: false });
  if (wishData) setWishes(wishData);

  // Tukar 'pax' kepada 'bilangan_pax'
  const { data: rsvpData } = await supabase.from('rsvp').select('bilangan_pax').eq('hadir', true);
  if (rsvpData) setRsvps(rsvpData);
};

  useEffect(() => {
    fetchData();
    const checkRsvp = localStorage.getItem('wedding_rsvp_submitted');
    if (checkRsvp) setHasSubmittedRsvp(true);
  }, []);

  const handleRsvp = async (formData) => {
    setLoading(true);
    const { error } = await supabase.from('rsvp').insert([formData]);
    
    if (error) {
      console.error("RSVP Error:", error.message);
      setLoading(false);
      return false;
    }

    localStorage.setItem('wedding_rsvp_submitted', 'true');
    setHasSubmittedRsvp(true);
    await fetchData();
    setLoading(false);
    return true;
  };

  const handleWish = async (formData) => {
    const { error } = await supabase.from('wishes').insert([formData]);
    if (!error) fetchData();
    return !error;
  };

  if (!isOpen) {
    return (
      <div className="h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-8 text-white font-sans overflow-hidden">
        <div className="relative w-full max-w-sm group cursor-pointer" onClick={() => setIsOpen(true)}>
          <div className="absolute -inset-1 bg-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000" className="w-full h-full object-cover opacity-60" alt="Thumbnail" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-11 bg-red-600 rounded-lg flex items-center justify-center shadow-2xl">
                <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-white ml-1"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase italic">Wedding Premiere</h1>
          <p className="text-gray-400 text-[10px] tracking-[0.4em] font-light italic">AIMAN × ADINDA</p>
          <button onClick={() => setIsOpen(true)} className="mt-10 px-12 py-3.5 bg-white text-black rounded-full font-bold text-xs tracking-widest active:scale-95 transition-all shadow-xl">WATCH NOW</button>
        </div>
      </div>
    );
  }

  return (
    <MainContent 
      wishes={wishes} 
      rsvps={rsvps} 
      onRsvp={handleRsvp} 
      onWish={handleWish} 
      isSubmitting={loading} 
      hasSubmittedRsvp={hasSubmittedRsvp}
    />
  );
}