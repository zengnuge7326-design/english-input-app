// Standard QWERTY Finger Mapping
export const FINGER_MAP = {
  // Left Hand
  '`': 'pinky-l', '1': 'pinky-l', 'q': 'pinky-l', 'a': 'pinky-l', 'z': 'pinky-l',
  '2': 'ring-l', 'w': 'ring-l', 's': 'ring-l', 'x': 'ring-l',
  '3': 'middle-l', 'e': 'middle-l', 'd': 'middle-l', 'c': 'middle-l',
  '4': 'index-l', 'r': 'index-l', 'f': 'index-l', 'v': 'index-l',
  '5': 'index-l', 't': 'index-l', 'g': 'index-l', 'b': 'index-l',
  
  // Right Hand
  '6': 'index-r', 'y': 'index-r', 'h': 'index-r', 'n': 'index-r',
  '7': 'index-r', 'u': 'index-r', 'j': 'index-r', 'm': 'index-r',
  '8': 'middle-r', 'i': 'middle-r', 'k': 'middle-r', ',': 'middle-r',
  '9': 'ring-r', 'o': 'ring-r', 'l': 'ring-r', '.': 'ring-r',
  '0': 'pinky-r', 'p': 'pinky-r', ';': 'pinky-r', '/': 'pinky-r',
  '-': 'pinky-r', '=': 'pinky-r', '[': 'pinky-r', ']': 'pinky-r', '\\': 'pinky-r', '\'': 'pinky-r',
  
  // Space
  ' ': 'thumb'
};

export const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
];

export const getFingerName = (key) => {
  if (!key) return 'unknown';
  const k = key.toLowerCase();
  return FINGER_MAP[k] || 'unknown';
};

export const getFingerByChar = (char) => {
  if (!char) return null;
  const c = char.toLowerCase();
  return FINGER_MAP[c] || null;
};

export const calculateStats = (correct, total, startTime) => {
  if (total === 0) return { wpm: 0, accuracy: 100 };
  const accuracy = Math.round((correct / total) * 100);
  const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
  const wpm = Math.round((correct / 5) / timeElapsed);
  return { wpm: wpm || 0, accuracy };
};
