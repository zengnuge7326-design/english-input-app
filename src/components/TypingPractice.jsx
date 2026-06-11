import React, { useState, useEffect, useCallback } from 'react';
import PageBackBar from './PageBackBar';
import VirtualKeyboard from './VirtualKeyboard';
import { calculateStats } from '../typing/KeyboardEngine';
import {
  TYPING_SOUND_PRESETS,
  resumeTypingAudio,
  playTypingKeySound,
  previewTypingSound,
} from '../typing/TypingKeySounds';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, RefreshCw, Volume2, VolumeX, Zap } from 'lucide-react';
import { LESSONS } from '../typing/lessons';

const CHAR_WIDTH = 40;

export default function TypingPractice({ onClose }) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [text, setText] = useState(LESSONS[0].content);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const [isFinished, setIsFinished] = useState(false);
  const [showHands, setShowHands] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundPreset, setSoundPreset] = useState(() => {
    try {
      const s = localStorage.getItem('typingSoundPreset');
      if (s && TYPING_SOUND_PRESETS.some(p => p.id === s)) return s;
    } catch { /* ignore */ }
    return TYPING_SOUND_PRESETS[0].id;
  });
  /** 用户点击过某一预设后，才认为已满足浏览器的 AudioContext 手势策略 */
  const [typingAudioPrimed, setTypingAudioPrimed] = useState(false);

  const setupTest = useCallback((lessonIndex = currentLesson) => {
    setText(LESSONS[lessonIndex].content);
    setCurrentIndex(0);
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 100 });
    setIsFinished(false);
    setErrorKey(null);
  }, [currentLesson]);

  const handleKeyDown = useCallback((e) => {
    const { key } = e;

    if (isFinished && key === 'Enter') {
      const next = Math.min(LESSONS.length - 1, currentLesson + 1);
      setCurrentLesson(next);
      setupTest(next);
      return;
    }
    if (isFinished) return;

    let currentKey = key;
    const fullToHalf = { '；': ';', '，': ',', '。': '.', '：': ':', '？': '?', '！': '!' };
    if (fullToHalf[currentKey]) currentKey = fullToHalf[currentKey];
    if (currentKey.length > 1 && currentKey !== ' ') return;

    if (soundEnabled && typingAudioPrimed) {
      const target = text[currentIndex];
      let keyType = 'char';
      if (currentKey === ' ') keyType = 'space';
      else if (currentKey === 'Backspace') keyType = 'backspace';
      let wrong = false;
      if (keyType === 'char') wrong = currentKey !== target;
      else if (keyType === 'space') wrong = target !== ' ';
      playTypingKeySound(soundPreset, { wrong, keyType });
    }

    if ([';', '/', "'", ' '].includes(currentKey)) e.preventDefault();

    setActiveKey(currentKey);
    let effectiveStartTime = startTime;
    if (!startTime) { effectiveStartTime = Date.now(); setStartTime(effectiveStartTime); }

    const target = text[currentIndex];
    if (currentKey === target) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setErrorKey(null);
      if (effectiveStartTime) setStats(calculateStats(nextIndex, nextIndex, effectiveStartTime));
      if (nextIndex === text.length) setIsFinished(true);
    } else {
      setErrorKey(currentKey);
    }
  }, [currentIndex, text, startTime, isFinished, currentLesson, setupTest, soundEnabled, typingAudioPrimed, soundPreset]);

  const pickSoundPreset = useCallback(async (id) => {
    setSoundPreset(id);
    try {
      localStorage.setItem('typingSoundPreset', id);
    } catch { /* ignore */ }
    await resumeTypingAudio();
    setTypingAudioPrimed(true);
    previewTypingSound(id);
  }, []);

  const handleKeyUp = useCallback(() => setActiveKey(null), []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => setStats(calculateStats(currentIndex, currentIndex, startTime)), 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, currentIndex, isFinished]);

  const targetKey = text[currentIndex];

  return (
    <div className="w-full flex flex-col items-center relative overflow-hidden" style={{ minHeight: '80vh', background: 'linear-gradient(to bottom, #050505 0%, #0a0a0a 100%)' }}>
      {/* 课程卡片横向滚动 */}
      <div className="w-full px-4 flex justify-center mt-2 mb-2 z-20">
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-5xl w-full" style={{ scrollbarWidth: 'none' }}>
          {LESSONS.map((lesson, idx) => (
            <motion.button
              key={lesson.id}
              onClick={() => { setCurrentLesson(idx); setupTest(idx); }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-40 p-2.5 rounded-xl border transition-all text-left relative overflow-hidden ${
                currentLesson === idx
                  ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <div className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${currentLesson === idx ? 'text-indigo-400' : 'text-white/30'}`}>
                Stage {String(lesson.id).padStart(2, '0')}
              </div>
              <div className={`text-xs font-bold truncate ${currentLesson === idx ? 'text-white' : 'text-white/80'}`}>
                {lesson.titleCn}
              </div>
              {currentLesson === idx && <motion.div layoutId="activeLesson" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 速度 / 准确率 + 键盘音效（Web Audio，点选即解锁） */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mb-3 w-full max-w-4xl px-2">
        <div className="flex gap-12">
          <div className="text-center">
            <div className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-0.5">速度</div>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              {stats.wpm} <span className="text-xs text-indigo-400 font-bold">WPM</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-0.5">准确率</div>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              {stats.accuracy} <span className="text-xs text-emerald-400 font-bold">%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-[min(100%,280px)]">
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/35">
            {typingAudioPrimed ? (
              <Volume2 size={12} className="text-emerald-400/90 shrink-0" />
            ) : (
              <VolumeX size={12} className="text-amber-400/80 shrink-0" />
            )}
            <span>键盘音效</span>
            {!typingAudioPrimed && <span className="normal-case font-semibold text-amber-400/90 tracking-normal">（点下面任选一项启用）</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {TYPING_SOUND_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pickSoundPreset(p.id)}
                title={p.desc}
                className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all active:scale-95 ${
                  soundPreset === p.id
                    ? 'bg-indigo-500/25 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                    : 'bg-white/5 border-white/15 text-white/55 hover:border-white/35 hover:text-white/85'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 滑动字符带 */}
      <div className="relative w-full max-w-4xl flex justify-center items-center mb-4 overflow-hidden h-24">
        <div className="absolute left-1/2 -translate-x-1/2 w-[54px] h-[72px] border-b-2 border-indigo-500/40 flex flex-col justify-end items-center z-10 pointer-events-none">
          <motion.div className="w-0.5 h-8 bg-indigo-500 mb-1 shadow-[0_0_8px_#6366f1]"
            animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
        <motion.div
          className="flex whitespace-nowrap font-mono text-5xl font-black tracking-wider"
          animate={{ x: (text.length / 2 - currentIndex) * CHAR_WIDTH - CHAR_WIDTH / 2 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
          {text.split('').map((char, i) => (
            <div key={i} style={{ width: `${CHAR_WIDTH}px` }}
              className={`flex justify-center transition-all duration-200 ${
                i < currentIndex ? 'text-white/10 blur-[1px]' :
                i === currentIndex ? 'text-indigo-400 scale-110 drop-shadow-[0_0_12px_#6366f1]' :
                'text-white/30'
              }`}>
              {char === ' ' ? '␣' : char}
            </div>
          ))}
        </motion.div>
      </div>

      {/* 键盘 */}
      <VirtualKeyboard activeKey={activeKey} targetKey={targetKey} errorKey={errorKey} showHands={showHands} />

      {/* 底部控制 */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => setShowHands(!showHands)}
          className={`flex items-center gap-2 px-5 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            showHands ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          <MousePointer2 size={12} className={showHands ? 'animate-bounce' : ''} />
          {showHands ? '指法引导 ON' : '指法引导 OFF'}
        </button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-5 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            soundEnabled ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          {soundEnabled ? '音效 ON' : '音效 OFF'}
        </button>
        <button
          onClick={() => setupTest()}
          className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
        >
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-[10px] font-black uppercase tracking-widest">重新开始</span>
        </button>
      </div>

      {/* 完成弹窗 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#080808] border border-white/10 p-16 rounded-[40px] text-center max-w-lg w-full">
              <div className="text-indigo-400 mb-6 flex justify-center"><Zap size={72} fill="currentColor" className="drop-shadow-[0_0_20px_#6366f1]" /></div>
              <h2 className="text-4xl font-black mb-10 tracking-tight uppercase text-white">闯关成功！</h2>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="text-[10px] text-white/20 uppercase font-black mb-2 tracking-widest">最终速度</div>
                  <div className="text-5xl font-black text-white">{stats.wpm}</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="text-[10px] text-white/20 uppercase font-black mb-2 tracking-widest">准确率</div>
                  <div className="text-5xl font-black text-emerald-400">{stats.accuracy}%</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setupTest()}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest border border-white/10 transition-all">
                  重新挑战
                </button>
                <button onClick={() => { const next = Math.min(LESSONS.length - 1, currentLesson + 1); setCurrentLesson(next); setupTest(next); }}
                  className="flex-[2] py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                  下一关 (Enter)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
