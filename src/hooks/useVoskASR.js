import { useState, useRef, useEffect, useCallback } from 'react';

export function useVoskASR() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizingResult, setRecognizingResult] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    window.electronAPI?.stopASR();
    setIsRecording(false);
  }, []);

  const start = useCallback(async () => {
    if (!window.electronAPI) {
      setRecognizingResult('❌ 错误: 仅支持在桌面客户端使用离线识别');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        window.electronAPI.sendAudio(pcmData.buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      
      setIsRecording(true);
      setIsFinal(false);
      setRecognizingResult('🎤 正在倾听... (离线识别)');
    } catch (err) {
      console.error('ASR start error:', err);
      setRecognizingResult(`❌ 无法启动麦克风: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    if (!window.electronAPI) return;

    const handlePartial = (data) => {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setRecognizingResult(`听到: "${parsed.partial || ''}..."`);
    };

    const handleResult = (data) => {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed.text) {
        setRecognizingResult(`听到: "${parsed.text}"`);
        setIsFinal(true);
      }
    };

    const handleFinal = (data) => {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed.text) {
        setRecognizingResult(`听到: "${parsed.text}"`);
        setIsFinal(true);
      }
    };

    window.electronAPI.onPartialResult(handlePartial);
    window.electronAPI.onResult(handleResult);
    window.electronAPI.onFinalResult(handleFinal);

    return () => {
      // Clean up listeners is handled in preload or here if provided
    };
  }, []);

  return {
    isRecording,
    recognizingResult,
    isFinal,
    start,
    stop,
    setRecognizingResult // for manual resets
  };
}
