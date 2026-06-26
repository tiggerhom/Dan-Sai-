import React, { useState, useEffect } from 'react';
import { ControlBindings, CONTROL_LABELS } from '../types';
import { playClickSound, playCollectSound } from '../lib/audio';
import { RotateCcw, Keyboard, Check, ShieldAlert, Award } from 'lucide-react';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  controls: ControlBindings;
  onSaveControls: (newControls: ControlBindings) => void;
}

export default function OptionsModal({ isOpen, onClose, controls, onSaveControls }: OptionsModalProps) {
  const [tempControls, setTempControls] = useState<ControlBindings>({ ...controls });
  const [rebindingKey, setRebindingKey] = useState<keyof ControlBindings | null>(null);

  useEffect(() => {
    setTempControls({ ...controls });
  }, [controls, isOpen]);

  // Handle key capture for rebinding
  useEffect(() => {
    if (!rebindingKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      // Don't bind Escape to game actions as it should be reserved, but other keys are fine
      if (e.key === 'Escape') {
        setRebindingKey(null);
        return;
      }

      // Convert spaces to a readable string label
      const keyName = e.key === ' ' ? 'Space' : e.key.toLowerCase();
      
      setTempControls((prev) => ({
        ...prev,
        [rebindingKey]: keyName,
      }));
      
      setRebindingKey(null);
      playCollectSound();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rebindingKey]);

  if (!isOpen) return null;

  const handleReset = () => {
    const defaults: ControlBindings = {
      left: 'a',
      right: 'd',
      jump: 'w',
      action: 's',
    };
    setTempControls(defaults);
    playClickSound();
  };

  const handlePresetArrow = () => {
    setTempControls({
      left: 'arrowleft',
      right: 'arrowright',
      jump: 'arrowup',
      action: ' ',
    });
    playCollectSound();
  };

  const handleSave = () => {
    onSaveControls(tempControls);
    playClickSound();
    onClose();
  };

  const formatKeyName = (key: string) => {
    if (key === ' ') return 'Space';
    if (key === 'arrowleft') return '← Arrow Left';
    if (key === 'arrowright') return '→ Arrow Right';
    if (key === 'arrowup') return '↑ Arrow Up';
    if (key === 'arrowdown') return '↓ Arrow Down';
    return key.toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        id="options-dialog"
        className="w-full max-w-lg bg-zinc-950 border-2 border-red-700 rounded-2xl overflow-hidden shadow-2xl shadow-red-950/40 font-kanit"
      >
        {/* Border header accent */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 tracking-wider flex items-center gap-2">
              <Keyboard className="w-8 h-8 text-yellow-500 animate-pulse" />
              ตั้งค่าปุ่มควบคุม (OPTIONS)
            </h2>
          </div>

          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            คลิกที่กล่องปุ่มที่ต้องการเปลี่ยน แล้วกดปุ่มใดๆ บนคีย์บอร์ดของคุณเพื่อตั้งค่าใหม่
          </p>

          {/* Key Binding List */}
          <div className="space-y-4 mb-8">
            {(Object.keys(tempControls) as Array<keyof ControlBindings>).map((actionKey) => {
              const isBindingThis = rebindingKey === actionKey;
              return (
                <div 
                  key={actionKey}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
                >
                  <span className="text-zinc-300 font-medium text-base">
                    {CONTROL_LABELS[actionKey]}
                  </span>

                  <button
                    id={`bind-btn-${actionKey}`}
                    onClick={() => {
                      playClickSound();
                      setRebindingKey(actionKey);
                    }}
                    className={`px-4 py-2 rounded-lg font-bold min-w-[120px] text-center transition-all ${
                      isBindingThis
                        ? 'bg-yellow-500 text-black animate-pulse shadow-md shadow-yellow-500/20 scale-105'
                        : 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {isBindingThis ? 'กดปุ่มใหม่...' : formatKeyName(tempControls[actionKey])}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Presets */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
              ชุดปุ่มแนะนำ (PRESETS)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="preset-default"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm transition"
              >
                <RotateCcw className="w-4 h-4 text-zinc-400" />
                ค่าเริ่มต้น (W/A/S/D)
              </button>
              <button
                id="preset-arrows"
                onClick={handlePresetArrow}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm transition"
              >
                <Keyboard className="w-4 h-4 text-zinc-400" />
                ปุ่มลูกศร + Space
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              id="cancel-options"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold transition border border-zinc-800"
            >
              ยกเลิก
            </button>
            <button
              id="save-options"
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white font-bold transition shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
