"use client";
import { useState, useEffect, useRef } from 'react';

export default function MainContent({ wishes, rsvps, onRsvp, onWish, isSubmitting, hasSubmittedRsvp }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('yes'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");
  const videoRef = useRef(null);

  // Logic: Kira Total Pax guna 'bilangan_pax' ikut database kau
  const totalGuests = rsvps ? rsvps.reduce((sum, item) => sum + (Number(item.bilangan_pax) || 0), 0) : 0;

  // Countdown Logic
  useEffect(() => {
    const targetDate = new Date("June 21, 2026 12:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 0) { clearInterval(interval); setTimeLeft("LIVE NOW"); }
      else { setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`); }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pagination Logic
  const itemsPerPage = 10;
  const currentWishes = wishes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(wishes.length / itemsPerPage);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => setIsPlaying(false));
      const updateProgress = () => setProgress((video.currentTime / video.duration) * 100);
      video.addEventListener('timeupdate', updateProgress);
      return () => video.removeEventListener('timeupdate', updateProgress);
    }
  }, []);

  const getTimeAgo = (dateString) => {
    if (!dateString) return "just now";
    const past = new Date(dateString);
    const diff = Math.floor((new Date() - past) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full bg-[#0f0f0f] z-[100] h-14 px-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-600"><path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
          <span className="font-bold text-lg tracking-tighter uppercase italic">ILY</span>
        </div>
        <div className="flex gap-5 items-center">
          <span className="text-xl opacity-50">🔍</span>
          <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/10 shadow-lg">A</div>
        </div>
      </nav>

      {/* VIDEO PLAYER */}
      <div className="fixed top-14 w-full z-[50] bg-black shadow-lg">
        <div className="relative aspect-video w-full bg-black overflow-hidden" onClick={() => { if(videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); } else { videoRef.current.pause(); setIsPlaying(false); } }}>
          <video ref={videoRef} src="https://www.w3schools.com/html/mov_bbb.mp4" className="w-full h-full object-contain" loop muted playsInline />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                 <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white ml-1"></div>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 pointer-events-none">
            <div className="h-full bg-red-600 relative shadow-[0_0_10px_red]" style={{ width: `${progress}%` }}>
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-600 rounded-full shadow-[0_0_12px_rgba(255,0,0,1)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="mt-[calc(56px+56.25vw)] pb-12">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-[19px] font-bold leading-tight uppercase tracking-tight">THE WEDDING: Aiman & Adinda — Save The Date 21.06.2026 (Official Premiere)</h1>
          <div className="flex items-center gap-2 mt-2 text-[12px] font-medium">
            <span className="text-white bg-white/10 px-2 py-0.5 rounded-sm">{totalGuests} waiting</span>
            <span className="text-[#aaaaaa]">•</span>
            <span className="text-red-500 font-bold animate-pulse uppercase">Premiering in {timeLeft}</span>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm italic">A</div>
              <div>
                <p className="text-[15px] font-bold">Aiman & Adinda</p>
                <p className="text-[#aaaaaa] text-[12px]">1.5M subscribers</p>
              </div>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold active:scale-95 transition-transform">Subscribe</button>
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className="bg-[#272727] rounded-xl p-3 text-[13px] leading-relaxed border border-white/5">
            <div className="font-bold mb-2">Description</div>
            <div className="space-y-4">
              <p>Alhamdulillah, we are getting married! 💍 Kami menjemput anda ke majlis kami.</p>
              <div className="space-y-3 pt-3 border-t border-white/10 text-white">
                <div className="flex gap-3"><span className="opacity-80">📍</span><div><p className="font-bold text-[11px] uppercase tracking-wide">Venue</p><p className="text-sm font-semibold">Crazy Rich Asian Hall by Kamalinda</p></div></div>
                <div className="flex gap-3"><span className="opacity-80">📅</span><div><p className="font-bold text-[11px] uppercase tracking-wide text-red-500 tracking-wider">Sunday, 21 June 2026</p><p className="text-[#aaaaaa] text-[12px]">12:00 PM - 4:00 PM</p></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP ACTION BUTTON */}
        <div className="px-4 mt-6">
          <div className="bg-gradient-to-r from-[#212121] to-[#2d2d2d] rounded-xl p-5 border border-white/10 shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold">Attendance</h2>
              <p className="text-[11px] text-[#aaaaaa]">{hasSubmittedRsvp ? 'Confirmation sent' : 'RSVP to join the list'}</p>
            </div>
            <button 
              disabled={hasSubmittedRsvp} 
              onClick={() => setIsRsvpOpen(true)} 
              className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 ${hasSubmittedRsvp ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600 text-white'}`}
            >
              {hasSubmittedRsvp ? '✓ CONFIRMED' : 'JOIN'}
            </button>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="px-4 mt-6">
          <div className="bg-[#272727] rounded-xl overflow-hidden border border-white/5 p-4 shadow-sm">
            <h2 className="font-bold text-[14px] mb-4">Comments <span className="text-[#aaaaaa] font-normal ml-2">{wishes.length}</span></h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const ok = await onWish({ nama: e.target.comment_nama.value, wish_message: e.target.wish.value });
              if (ok) { e.target.wish.value = ''; setCurrentPage(1); }
            }} className="space-y-4 mb-8">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0 uppercase">T</div>
                <div className="flex-1 space-y-3">
                  <input name="comment_nama" placeholder="Your name..." required className="w-full bg-white/5 border-b border-white/10 py-1 text-[12px] font-bold outline-none focus:border-white text-white" />
                  <input name="wish" placeholder="Add a public comment..." required className="w-full bg-transparent border-b border-white/20 pb-1 text-[13px] outline-none focus:border-white" />
                  <div className="flex justify-end pt-1"><button type="submit" className="bg-[#3ea6ff] text-black px-4 py-1.5 rounded-full text-[12px] font-bold">Comment</button></div>
                </div>
              </div>
            </form>
            <div className="space-y-6">
              {currentWishes.map((w, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white uppercase">{w.nama?.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><p className="text-[11px] font-bold text-white">@{w.nama?.toLowerCase().replace(/\s+/g, '')}</p><p className="text-[#aaaaaa] text-[10px]">{getTimeAgo(w.created_at)}</p></div>
                    <p className="text-[13px] text-[#f1f1f1] mt-0.5 leading-relaxed">{w.wish_message}</p>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8 pt-4 border-t border-white/5">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-md disabled:opacity-20 transition-all">PREV</button>
                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`w-6 h-6 rounded-full text-[10px] font-bold ${currentPage === idx + 1 ? 'bg-white text-black' : 'text-[#aaaaaa]'}`}>{idx + 1}</button>
                  ))}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-md disabled:opacity-20 transition-all">NEXT</button>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="py-20 text-center opacity-10 text-[10px] tracking-[0.5em] font-bold">
          #AIMANXADINDA
        </div>
      </main>

      {/* RSVP MODAL POPUP */}
      {isRsvpOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/80 backdrop-blur-sm">
          <div className="flex-1 w-full" onClick={() => setIsRsvpOpen(false)}></div>
          <div className="bg-[#212121] w-full rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-4 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#212121] z-10">
              <h2 className="font-bold text-lg">Confirm Attendance</h2>
              <button onClick={() => setIsRsvpOpen(false)} className="text-2xl p-2">&times;</button>
            </div>
            <div className="p-6 pb-12">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const f = e.target;
                const isHadir = attendanceStatus === 'yes';
                
                const formData = new FormData(f);
                const selectedPax = formData.get('pax');
                const paxVal = isHadir ? parseInt(selectedPax || 1) : 0;
                
                // Gunakan 'bilangan_pax' ikut database kau
                const ok = await onRsvp({ 
                  nama: f.nama.value, 
                  bilangan_pax: paxVal, 
                  hadir: isHadir 
                });
                
                if (ok) setIsRsvpOpen(false);
              }} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#aaaaaa] uppercase tracking-wider">Guest Name</p>
                  <input name="nama" placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-white outline-none" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#aaaaaa] uppercase tracking-wider">Will you attend?</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setAttendanceStatus('yes')} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${attendanceStatus === 'yes' ? 'bg-green-600 text-white shadow-lg' : 'bg-white/5 text-[#aaaaaa]'}`}>YES</button>
                    <button type="button" onClick={() => setAttendanceStatus('no')} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${attendanceStatus === 'no' ? 'bg-red-600 text-white shadow-lg' : 'bg-white/5 text-[#aaaaaa]'}`}>NO</button>
                  </div>
                </div>
                {attendanceStatus === 'yes' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#aaaaaa] uppercase tracking-wider">Total Pax</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <label key={num} className="cursor-pointer">
                          <input type="radio" name="pax" value={num} defaultChecked={num === 1} className="hidden peer" />
                          <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium peer-checked:bg-white peer-checked:text-black transition-all">{num}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <button disabled={isSubmitting} className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm active:scale-95 transition-all mt-4 uppercase tracking-widest">{isSubmitting ? 'Sending...' : 'Confirm RSVP'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
      <style jsx>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } `}</style>
    </div>
  );
}