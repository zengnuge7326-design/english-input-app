import { motion, AnimatePresence } from 'framer-motion';
import TypingHands from './TypingHands';
import { getFingerByChar } from '../typing/KeyboardEngine';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

const KEY_DISPLAY = {
  'Backspace': 'Back',
  'CapsLock': 'Caps',
  'Tab': 'Tab',
  'Enter': 'Enter',
  'Shift': 'Shift',
  'Space': '',
  'Ctrl': 'Ctrl',
  'Win': 'Win',
  'Alt': 'Alt',
  'Menu': 'Menu'
};

const KEY_WIDTHS = {
  'Backspace': 'w-32',
  'Tab': 'w-20',
  '\\': 'w-20',
  'CapsLock': 'w-28',
  'Enter': 'w-32',
  'Shift': 'w-36',
  'Space': 'flex-grow mx-4',
  'Ctrl': 'w-20',
  'Alt': 'w-20',
  'Win': 'w-16',
  'Menu': 'w-16'
};

const VirtualKeyboard = ({ activeKey, targetKey, errorKey, showHands }) => {
  const targetFinger = getFingerByChar(targetKey);
  const [targetPos, setTargetPos] = useState(null);
  const keyRefs = useRef({});
  const containerRef = useRef(null);

  // Track target key position relative to the GRID (not the outer container)
  useLayoutEffect(() => {
    if (targetKey && keyRefs.current[targetKey.toLowerCase()]) {
      const keyEl = keyRefs.current[targetKey.toLowerCase()];
      // Find the grid container (first parent of keys)
      const gridEl = keyEl.closest('.keyboard-grid'); 
      if (keyEl && gridEl) {
        const keyRect = keyEl.getBoundingClientRect();
        const gridRect = gridEl.getBoundingClientRect();
        
        setTargetPos({
          x: keyRect.left - gridRect.left + keyRect.width / 2,
          y: keyRect.top - gridRect.top + keyRect.height / 2,
          gridWidth: gridRect.width,
          gridHeight: gridRect.height
        });
      }
    } else {
      setTargetPos(null);
    }
  }, [targetKey]);

  const layout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
  ];

  const getKeyClass = (key) => {
    const isTarget = key.toLowerCase() === targetKey?.toLowerCase();
    const isActive = key.toLowerCase() === activeKey?.toLowerCase();
    const isError = key.toLowerCase() === errorKey?.toLowerCase();
    const isHome = key.toLowerCase() === 'f' || key.toLowerCase() === 'j';
    
    let base = `glass-key h-12 md:h-14 m-0.5 md:m-1 text-lg md:text-xl font-bold select-none ${KEY_WIDTHS[key] || 'w-12 md:w-14 flex-shrink-0'}`;
    
    if (isError) return `${base} error`;
    if (isActive) return `${base} active`;
    if (isTarget) return `${base} target`;
    return base;
  };

  return (
    <div 
      ref={containerRef}
      className="keyboard-container flex flex-col items-center bg-black/40 p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-visible" 
      style={{ perspective: '1200px' }}
    >
      {/* Instruction Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 text-white/40 text-sm font-medium tracking-wide flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
        根据触键提示，开始学习正确的指法
      </motion.div>

      <div className="keyboard-grid flex flex-col gap-1 w-full max-w-6xl relative">
        {/* Virtual Hands Overlay - Locked to Grid Coordinates */}
        <AnimatePresence>
          {showHands && targetPos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <TypingHands activeFinger={targetFinger} targetPos={targetPos} />
            </motion.div>
          )}
        </AnimatePresence>

        {layout.map((row, i) => (
          <div key={i} className="flex justify-center w-full">
            {row.map((key, j) => (
              <motion.div 
                key={`${i}-${j}`}
                ref={el => keyRefs.current[key.toLowerCase()] = el}
                className={getKeyClass(key)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i * 0.1) + (j * 0.02) }}
              >
                {KEY_DISPLAY[key] !== undefined ? KEY_DISPLAY[key] : key}
                

                {(key.toLowerCase() === 'f' || key.toLowerCase() === 'j') && (
                  <div className="absolute bottom-2 w-4 h-0.5 bg-white/30 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Finger Legend */}
      <div className="mt-8 flex gap-4 text-xs text-white/40 uppercase tracking-widest">
         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div> Next Key</div>
         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> Pressed</div>
         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Error</div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
