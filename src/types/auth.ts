export interface KeystrokeData {
  keyDownTime: number;
  keyUpTime: number;
  key: string;
}

export interface KeystrokePattern {
  durationTimes: number[];
  flightTimes: number[];
}

export interface UserData {
  username: string;
  password: string;
  keystrokePatterns: KeystrokePattern[];
}