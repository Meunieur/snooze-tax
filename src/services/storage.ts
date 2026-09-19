import { Alarm, AppSettings, SnoozeRecord, UserStats } from '../types';

const STORAGE_KEYS = {
  ALARMS: 'nice_alarm_items',
  SETTINGS: 'nice_alarm_settings',
  RECORDS: 'nice_alarm_records',
  STATS: 'nice_alarm_stats'
};

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  defaultFeeUSD: 5,
  defaultFeeVND: 50000,
  savageRoast: true,
  voiceAudioRoast: true,
  hapticEnabled: true,
  soundVolume: 0.8,
  language: 'vi'
};

export const INITIAL_ALARMS: Alarm[] = [
  {
    id: 'alarm-1',
    time: '06:30',
    label: 'Dậy đi làm làm giàu cho tư bản',
    enabled: true,
    days: [1, 2, 3, 4, 5],
    snoozeFee: 5,
    currency: 'USD',
    snoozeCount: 0,
    soundTone: 'digital',
    mathChallenge: true
  },
  {
    id: 'alarm-2',
    time: '07:15',
    label: 'Chạy bộ thể dục săn múi',
    enabled: false,
    days: [1, 3, 5, 6],
    snoozeFee: 10,
    currency: 'USD',
    snoozeCount: 0,
    soundTone: 'nuclear',
    mathChallenge: true
  }
];

export const INITIAL_STATS: UserStats = {
  walletBalanceUSD: 0,
  walletBalanceVND: 0,
  totalPenaltyUSD: 0,
  totalPenaltyVND: 0,
  totalSnoozeCount: 0,
  totalOnTimeCount: 4,
  currentStreak: 2,
  worstDay: 'Chưa có'
};

export const loadAlarms = (): Alarm[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALARMS);
    if (!raw) {
      saveAlarms(INITIAL_ALARMS);
      return INITIAL_ALARMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALARMS;
  }
};

export const saveAlarms = (alarms: Alarm[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ALARMS, JSON.stringify(alarms));
  } catch (err) {
    console.error('Failed to save alarms:', err);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

export const loadRecords = (): SnoozeRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveRecords = (records: SnoozeRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records:', err);
  }
};

export const loadStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) {
      saveStats(INITIAL_STATS);
      return INITIAL_STATS;
    }
    return { ...INITIAL_STATS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATS;
  }
};

export const saveStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats:', err);
  }
};
