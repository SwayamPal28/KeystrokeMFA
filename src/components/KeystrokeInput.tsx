import React, { useState, useRef } from 'react';
import { KeystrokeData } from '../types/auth';

interface KeystrokeInputProps {
  onComplete: (keystrokes: KeystrokeData[]) => void;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export function KeystrokeInput({ onComplete, value, onChange, type = 'text' }: KeystrokeInputProps) {
  const [keystrokes, setKeystrokes] = useState<KeystrokeData[]>([]);
  const keystrokeBuffer = useRef<KeystrokeData[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') return;
    
    keystrokeBuffer.current.push({
      key: e.key,
      keyDownTime: performance.now(),
      keyUpTime: 0,
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onComplete(keystrokes);
      return;
    }

    const currentKeystroke = keystrokeBuffer.current.find(
      (k) => k.key === e.key && k.keyUpTime === 0
    );

    if (currentKeystroke) {
      currentKeystroke.keyUpTime = performance.now();
      setKeystrokes([...keystrokeBuffer.current]);
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}