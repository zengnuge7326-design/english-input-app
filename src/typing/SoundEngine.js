class SoundEngine {
  constructor() {
    this.context = null;
    this.buffers = {};
    this.isLoaded = false;
    this.enabled = true;
  }

  async init() {
    if (this.isLoaded) return;
    
    // Create AudioContext on demand (browser policy)
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }

    const soundFiles = {
      standard: '/sounds/key_standard.mp3',
      space: '/sounds/key_space.mp3',
      backspace: '/sounds/key_backspace.mp3'
    };

    try {
      const loadPromises = Object.entries(soundFiles).map(async ([key, url]) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.buffers[key] = audioBuffer;
      });

      await Promise.all(loadPromises);
      this.isLoaded = true;
      console.log('Mechanical sound engine ready: Clicky Blue Switch');
    } catch (error) {
      console.error('Failed to load sounds:', error);
    }
  }

  play(type = 'standard', pitch = 1.0) {
    if (!this.enabled || !this.isLoaded || !this.context) return;

    // Resume context if suspended
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const buffer = this.buffers[type] || this.buffers['standard'];
    if (!buffer) return;

    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();

    source.buffer = buffer;
    source.playbackRate.value = pitch + (Math.random() * 0.1 - 0.05); // Subtle pitch randomization for realism
    
    gainNode.gain.value = type === 'space' ? 0.8 : 0.6; // Balance volumes

    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    source.start(0);
  }

  toggle(state) {
    this.enabled = state !== undefined ? state : !this.enabled;
    return this.enabled;
  }
}

const engine = new SoundEngine();
export default engine;
