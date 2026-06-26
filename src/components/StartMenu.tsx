import React, { useState } from 'react';
import { Play, Settings, BookOpen, Volume2, VolumeX, ShieldAlert, KeyRound, MapPin, Sparkles } from 'lucide-react';
import { playClickSound, toggleMute, getMuteStatus } from '../lib/audio';

interface StartMenuProps {
  onStartGame: () => void;
  onOpenOptions: () => void;
  currentLeftKey: string;
  currentRightKey: string;
  currentJumpKey: string;
  currentActionKey: string;
}

export default function StartMenu({ 
  onStartGame, 
  onOpenOptions,
  currentLeftKey,
  currentRightKey,
  currentJumpKey,
  currentActionKey
}: StartMenuProps) {
  const [showLore, setShowLore] = useState(false);
  const [isMuted, setIsMuted] = useState(getMuteStatus());

  const handleMuteToggle = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    playClickSound();
  };

  const handleLoreToggle = () => {
    setShowLore(!showLore);
    playClickSound();
  };

  const formatKey = (key: string) => {
    if (key === ' ') return 'Space';
    return key.toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-between p-4 md:p-8 font-kanit relative overflow-hidden">
      
      {/* Visual background pattern / subtle lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-600/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-800/3 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Audio Control */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>ด่านซ้าย, จังหวัดเลย • ประเทศไทย</span>
        </div>
        
        <button
          id="menu-mute-toggle"
          onClick={handleMuteToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition text-zinc-400 hover:text-yellow-400"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-zinc-500" />
              <span className="text-xs">เปิดเสียงกลอง Isan</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-yellow-500 animate-bounce-short" />
              <span className="text-xs text-yellow-500 font-bold">กำลังเล่นกลองรำ</span>
            </>
          )}
        </button>
      </header>

      {/* 2. Main Content Card / Logo & Title */}
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-6 md:py-12 z-10 flex-1">
        
        {/* Logo Container with floating effect */}
        <div className="relative mb-6 animate-float">
          {/* Glowing background behind logo */}
          <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl scale-75" />
          <img 
            src="https://res.cloudinary.com/dsucg33fv/image/upload/v1782439979/logo_fj2ctz.png"
            alt="Dan Sai Adventure Logo"
            className="w-44 h-44 md:w-56 md:h-56 object-contain relative drop-shadow-[0_10px_20px_rgba(239,68,68,0.3)] select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Game Title styled in modern-traditional look */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 uppercase drop-shadow-sm font-kanit">
            Dan Sai Adventure
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto tracking-wide font-medium">
            ด่านซ้าย แอดเวนเจอร์ : ตำนานผีตาโขนผู้พิทักษ์
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4 mb-10">
          
          {/* เข้าเกม Button */}
          <button
            id="menu-start-game"
            onClick={() => {
              playClickSound();
              onStartGame();
            }}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 hover:from-red-500 hover:to-yellow-400 text-white font-extrabold text-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-red-950/40 flex items-center justify-center gap-2 border border-yellow-400/30"
          >
            <Play className="w-5 h-5 fill-white" />
            เข้าเกม (PLAY)
          </button>

          {/* Options / ตั้งค่า Button */}
          <button
            id="menu-open-options"
            onClick={() => {
              playClickSound();
              onOpenOptions();
            }}
            className="flex-1 py-4 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-yellow-400 font-extrabold text-base transition duration-200 transform hover:scale-105 active:scale-95 border-2 border-red-700/60 hover:border-red-500 shadow-md flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5 text-yellow-500" />
            การตั้งค่าปุ่ม (OPTIONS)
          </button>

        </div>

        {/* Current Keybindings Quick-Look Indicator */}
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl px-6 py-3 text-xs text-zinc-500 max-w-sm flex flex-col gap-1 shadow-inner">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1 justify-center">
            <KeyRound className="w-3.5 h-3.5 text-red-500" />
            <span>ปุ่มการบังคับตัวละครขณะนี้:</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left">
            <div>← ซ้าย: <span className="text-yellow-500 font-bold font-mono">{formatKey(currentLeftKey)}</span></div>
            <div>→ ขวา: <span className="text-yellow-500 font-bold font-mono">{formatKey(currentRightKey)}</span></div>
            <div>↑ กระโดด: <span className="text-yellow-500 font-bold font-mono">{formatKey(currentJumpKey)}</span></div>
            <div>🔔 ปราบผี: <span className="text-yellow-500 font-bold font-mono">{formatKey(currentActionKey)}</span></div>
          </div>
        </div>

        {/* Lore & Story Collapsible Block */}
        <div className="mt-8 w-full max-w-xl px-4">
          <button
            id="menu-toggle-lore"
            onClick={handleLoreToggle}
            className="text-xs font-bold text-zinc-400 hover:text-yellow-500 transition flex items-center gap-1.5 mx-auto py-2 px-4 rounded-xl bg-zinc-950 border border-zinc-900"
          >
            <BookOpen className="w-4 h-4" />
            {showLore ? 'ซ่อนตำนานผีตาโขน' : 'อ่านตำนานวัฒนธรรมผีตาโขนเมืองเลย'}
          </button>

          {showLore && (
            <div className="mt-4 p-5 rounded-2xl bg-zinc-950/90 border border-red-950 text-left text-zinc-300 text-xs md:text-sm leading-relaxed space-y-3 shadow-lg max-h-56 overflow-y-auto">
              <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                ประเพณีละเล่นผีตาโขน อ.ด่านซ้าย จ.เลย
              </h3>
              <p>
                <strong>ผีตาโขน</strong> เป็นเทศกาลที่เกิดขึ้นเฉพาะในอำเภอด่านซ้าย จังหวัดเลย โดยเป็นส่วนหนึ่งของงานบุญหลวง ซึ่งรวมเอา "บุญพระเวส" และ "บุญบั้งไฟ" เข้าไว้ด้วยกัน เป็นการละเล่นเพื่อฉลองการเสด็จกลับของพระเวสสันดรเข้าสู่เมือง
              </p>
              <p>
                การทำหน้ากากผีตาโขนโบราณทำจาก <strong>"โคนหน่อไม้"</strong> และส่วนของหมวกครอบทำจาก <strong>"หวดนึ่งข้าวเหนียว"</strong> แล้วนำมาแต่งแต้มลวดลายด้วยสีสันฉูดฉาดงดงาม ผู้ร่วมละเล่นจะสวมห้อยเครื่องส่งสัญญาณเสียง เช่น กระดิ่งผูกคอควายหรือกระดิ่งดินเผา (เรียกว่า หมากกะแหล่ง) แกว่งไกวส่งเสียงดังก้องกังวานตามจังหวะเดินเพื่อไล่สิ่งอัปมงคลและขอฝน
              </p>
              <p className="text-yellow-500/80 italic text-[11px]">
                *ในเกม Dan Sai Adventure คุณต้องควบคุมผู้สวมหน้ากาก เดินทางผ่านสายหมอกเพื่อสะสมกระติบข้าวเหนียว และแกว่งกระดิ่งศักดิ์สิทธิ์ปราบเหล่าผีขี้เล่นให้กลายร่างเป็นพลังวิญญาณแห่งมิตรภาพก่อนถึงวัดพระธาตุศรีสองรัก!
              </p>
            </div>
          )}
        </div>

      </main>

      {/* 3. Footer Copyright */}
      <footer className="w-full max-w-5xl mx-auto text-center text-[10px] text-zinc-600 pt-6 mt-4 border-t border-zinc-950 z-10">
        <p>© 2026 Dan Sai Adventure. วัฒนธรรมท้องถิ่นเลย สู่ระบบมินิเกมจำลองสัมผัสด้วยคีย์บอร์ดปรับแต่งเสรี</p>
      </footer>

    </div>
  );
}
