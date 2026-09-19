export type Currency = 'USD' | 'VND';

export type AlarmTone = 'nuclear' | 'digital' | 'airhorn' | 'retro' | 'rooster';

export interface Alarm {
  id: string;
  time: string; // "07:00"
  label: string;
  enabled: boolean;
  days: number[]; // 0: Sun, 1: Mon, ..., 6: Sat
  snoozeFee: number;
  currency: Currency;
  snoozeCount: number;
  soundTone: AlarmTone;
  mathChallenge: boolean;
}

export interface SnoozeRecord {
  id: string;
  alarmId: string;
  alarmLabel: string;
  timestamp: number;
  fee: number;
  currency: Currency;
  snoozeCountThisSession: number;
  roastMessage: string;
}

export interface UserStats {
  walletBalanceUSD: number;
  walletBalanceVND: number;
  totalPenaltyUSD: number;
  totalPenaltyVND: number;
  totalSnoozeCount: number;
  totalOnTimeCount: number;
  currentStreak: number;
  worstDay: string;
}

export interface AppSettings {
  currency: Currency;
  defaultFeeUSD: number;
  defaultFeeVND: number;
  savageRoast: boolean;
  voiceAudioRoast: boolean;
  hapticEnabled: boolean;
  soundVolume: number;
  language: 'vi' | 'en';
}
