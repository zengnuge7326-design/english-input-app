import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

// PRECISE FINGER PAD (TIP) CENTERS - Reverted to SLIM version peaks
const FINGER_ANCHORS = {
  'pinky-l': { x: 43, y: 80 }, 
  'ring-l': { x: 70.5, y: 65 },
  'middle-l': { x: 102.5, y: 55 },
  'index-l': { x: 136, y: 70 },
  'thumb-l': { x: 180, y: 120 },
  
  'pinky-r': { x: 357, y: 80 },
  'ring-r': { x: 329.5, y: 65 },
  'middle-r': { x: 297.5, y: 55 },
  'index-r': { x: 264, y: 70 },
  'thumb-r': { x: 220, y: 120 }
};

// Resting Home-Row key centers (relative to grid)
const HOME_ROW = {
  'pinky-l': 'a', 'ring-l': 's', 'middle-l': 'd', 'index-l': 'f',
  'pinky-r': ';', 'ring-r': 'l', 'middle-r': 'k', 'index-r': 'j'
};

const Finger = ({ id, activeFinger, path }) => {
  const isActive = activeFinger === id || (activeFinger === 'thumb' && id.startsWith('thumb'));
  
  return (
    <g>
      {isActive && (
        <path
          d={path}
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={{ 
            opacity: 1 
          }}
        />
      )}
      {isActive && (
        <path
          d={path}
          fill="rgba(168, 85, 247, 0.1)"
          stroke="none"
        />
      )}
    </g>
  );
};

const VIEWBOX_W = 400;
const VIEWBOX_H = 200;

const TypingHands = ({ activeFinger, targetPos, glowHand = false }) => {
  const scaleX = targetPos?.gridWidth ? targetPos.gridWidth / VIEWBOX_W : 1;
  const scaleY = targetPos?.gridHeight ? targetPos.gridHeight / VIEWBOX_H : 1;

  // RESTORED SLIM SILHOUETTE - Re-linked with webbing but using OLD geometric paths
  const leftHandSilhouette = "M38,165 L36,100 Q36,80 43,80 Q50,80 48,105 L48,165 Q55.5,155 63,165 L61,90 Q61,65 70.5,65 Q80,65 78,100 L78,165 Q85.5,155 93,165 L91,80 Q91,55 102.5,55 Q114,55 112,95 L112,165 Q119.5,155 127,165 L126,90 Q126,70 136,70 Q146,70 143,100 L143,165 Q147.5,175 152,185 Q168,175 185,150 Q192,135 180,120 Q168,105 157,130 L152,150 Q145,185 95,185 38,165 Z";
  const rightHandSilhouette = "M362,165 L364,100 Q364,80 357,80 Q350,80 352,105 L352,165 Q344.5,155 337,165 L339,90 Q339,65 329.5,65 Q320,65 322,100 L322,165 Q314.5,155 307,165 L309,80 Q309,55 297.5,55 Q286,55 288,95 L288,165 Q280.5,155 273,165 L274,90 Q274,70 264,70 Q254,70 257,100 L257,165 Q252.5,175 248,185 Q232,175 215,150 Q208,135 220,120 Q232,105 243,130 L248,150 Q255,185 305,185 362,165 Z";

  const leftPaths = [
    { id: 'pinky-l', path: "M38,165 L36,100 Q36,80 43,80 Q50,80 48,105 L48,165" },
    { id: 'ring-l', path: "M63,165 L61,90 Q61,65 70.5,65 Q80,65 78,100 L78,165" },
    { id: 'middle-l', path: "M102.5,165 L91,80 Q91,55 102.5,55 Q114,55 112,95 L112,165" },
    { id: 'index-l', path: "M127,165 L126,90 Q126,70 136,70 Q146,70 143,100 L143,165" },
    { id: 'thumb-l', path: "M152,185 Q168,175 185,150 Q192,135 180,120 Q168,105 157,130 L152,150" }
  ];

  const rightPaths = [
    { id: 'pinky-r', path: "M362,165 L364,100 Q364,80 357,80 Q350,80 352,105 L352,165" },
    { id: 'ring-r', path: "M337,165 L339,90 Q339,65 329.5,65 Q320,65 322,100 L322,165" },
    { id: 'middle-r', path: "M297.5,165 L309,80 Q309,55 297.5,55 Q286,55 288,95 L288,165" },
    { id: 'index-r', path: "M273,165 L274,90 Q274,70 264,70 Q254,70 257,100 L257,165" },
    { id: 'thumb-r', path: "M248,185 Q232,175 215,150 Q208,135 220,120 Q232,105 243,130 L248,150" }
  ];

  const leftHandMotion = useMemo(() => {
    const isLeft = activeFinger?.endsWith('-l') || activeFinger === 'thumb';
    if (isLeft && targetPos) {
      const fKey = activeFinger === 'thumb' ? 'thumb-l' : activeFinger;
      const anchor = FINGER_ANCHORS[fKey];
      
      // Safety check to prevent NaN errors
      if (anchor) {
        return { 
          left: targetPos.x - (anchor.x * scaleX), 
          top: targetPos.y - (anchor.y * scaleY),
          opacity: 0.95, filter: 'blur(0px)', zIndex: 50
        };
      }
    }
    return { left: 100, top: 200, opacity: 0, filter: 'blur(4px)', zIndex: 10 };
  }, [targetPos, activeFinger, scaleX, scaleY]);

  const rightHandMotion = useMemo(() => {
    const isRight = activeFinger?.endsWith('-r');
    if (isRight && targetPos) {
      const anchor = FINGER_ANCHORS[activeFinger];
      if (anchor) {
        return { 
          left: targetPos.x - (anchor.x * scaleX), 
          top: targetPos.y - (anchor.y * scaleY),
          opacity: 0.95, filter: 'blur(0px)', zIndex: 50
        };
      }
    }
    return { left: 400, top: 200, opacity: 0, filter: 'blur(4px)', zIndex: 10 };
  }, [targetPos, activeFinger, scaleX, scaleY]);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none overflow-visible">
      <motion.div animate={leftHandMotion} transition={{ type: 'spring', stiffness: 350, damping: 30 }} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0' }}>
        <svg width={VIEWBOX_W * scaleX} height={VIEWBOX_H * scaleY} viewBox="0 0 400 200" preserveAspectRatio="none">
           <path 
             d={leftHandSilhouette} 
             fill="none" 
             stroke={glowHand ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.22)"}
             strokeWidth={glowHand ? "1.6" : "1.2"}
           />
           {leftPaths.map(f => (
             <Finger key={f.id} id={f.id} activeFinger={activeFinger} path={f.path} />
           ))}
        </svg>
      </motion.div>

      <motion.div animate={rightHandMotion} transition={{ type: 'spring', stiffness: 350, damping: 30 }} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0' }}>
        <svg width={VIEWBOX_W * scaleX} height={VIEWBOX_H * scaleY} viewBox="0 0 400 200" preserveAspectRatio="none">
           <path 
             d={rightHandSilhouette} 
             fill="none" 
             stroke={glowHand ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.22)"}
             strokeWidth={glowHand ? "1.6" : "1.2"}
           />
           {rightPaths.map(f => (
             <Finger key={f.id} id={f.id} activeFinger={activeFinger} path={f.path} />
           ))}
        </svg>
      </motion.div>
    </div>
  );
};

export default TypingHands;
