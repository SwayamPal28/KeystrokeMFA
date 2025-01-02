import { KeystrokeData, KeystrokePattern } from '../types/auth';

export function calculateKeystrokeMetrics(keystrokes: KeystrokeData[]): KeystrokePattern {
  const durationTimes: number[] = [];
  const flightTimes: number[] = [];

  for (let i = 0; i < keystrokes.length; i++) {
    // Calculate duration time (how long a key is pressed)
    const duration = keystrokes[i].keyUpTime - keystrokes[i].keyDownTime;
    durationTimes.push(duration);

    // Calculate flight time (time between releasing a key and pressing the next one)
    if (i < keystrokes.length - 1) {
      const flight = keystrokes[i + 1].keyDownTime - keystrokes[i].keyUpTime;
      flightTimes.push(flight);
    }
  }

  return { durationTimes, flightTimes };
}

export function comparePatterns(
  storedPatterns: KeystrokePattern[],
  currentPattern: KeystrokePattern,
): boolean {
  // Calculate average patterns from stored samples
  const avgDurationTimes = calculateAveragePattern(storedPatterns.map(p => p.durationTimes));
  const avgFlightTimes = calculateAveragePattern(storedPatterns.map(p => p.flightTimes));

  // Calculate similarity scores
  const durationScore = calculateSimilarity(avgDurationTimes, currentPattern.durationTimes);
  const flightScore = calculateSimilarity(avgFlightTimes, currentPattern.flightTimes);

  // Threshold for authentication (can be adjusted)
  const THRESHOLD = 0.75;
  return (durationScore + flightScore) / 2 >= THRESHOLD;
}

function calculateAveragePattern(patterns: number[][]): number[] {
  const length = patterns[0].length;
  const result = new Array(length).fill(0);

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (const pattern of patterns) {
      sum += pattern[i];
    }
    result[i] = sum / patterns.length;
  }

  return result;
}

function calculateSimilarity(pattern1: number[], pattern2: number[]): number {
  if (pattern1.length !== pattern2.length) return 0;

  let similarity = 0;
  for (let i = 0; i < pattern1.length; i++) {
    const diff = Math.abs(pattern1[i] - pattern2[i]);
    const max = Math.max(pattern1[i], pattern2[i]);
    similarity += 1 - (diff / max);
  }

  return similarity / pattern1.length;
}