import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Clock,
  Sparkles,
  Download,
  CreditCard
} from 'lucide-react';
import { Alarm, AppSettings, SnoozeRecord, UserStats } from './types';
import {
  loadAlarms,
  saveAlarms,
  loadSettings,
  saveSettings,
  loadRecords,
  saveRecords,
  loadStats,
  saveStats
} from './services/storage';
import { Header } from './components/Header';
import { ClockDisplay } from './components/ClockDisplay';
import { AlarmCard } from './components/AlarmCard';
import { AlarmModal } from './components/AlarmModal';
import { ActiveAlarmOverlay } from './components/ActiveAlarmOverlay';
import { DebtLedgerModal } from './components/DebtLedgerModal';
import { SettingsModal } from './components/SettingsModal';
import { triggerHaptic } from './services/haptics';
import { Language, TRANSLATIONS } from './services/i18n';

export function App() {
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [records, setRecords] = useState<SnoozeRecord[]>(loadRecords);
  const [stats, setStats] = useState<UserStats>(loadStats);

  const t = TRANSLATIONS[settings.language];

  // Modals state
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active ringing alarm
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<Alarm | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');

  // PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = settings.language === 'en' ? 'vi' : 'en';
    const nextCurrency = nextLang === 'en' ? 'USD' : 'VND';
    setSettings(prev => ({
      ...prev,
      language: nextLang,
      currency: nextCurrency
    }));
    triggerHaptic('light');
    showToast(nextLang === 'en' ? 'Switched to English (USD)' : 'Đã chuyển sang Tiếng Việt (VNĐ)');
  };

  // Sync to localStorage
  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Listen for PWA install event
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Background Clock Ticker: check alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeRingingAlarm) return;

      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;
      const currentDay = now.getDay();

      if (lastTriggeredMinuteRef.current === currentTimeString) return;

      const matchingAlarm = alarms.find(
        alarm =>
          alarm.enabled &&
          alarm.time === currentTimeString &&
          (alarm.days.length === 0 || alarm.days.includes(currentDay))
      );

      if (matchingAlarm) {
        lastTriggeredMinuteRef.current = currentTimeString;
        setActiveRingingAlarm(matchingAlarm);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, activeRingingAlarm]);

  // Add or Edit Alarm
  const handleSaveAlarm = (
    alarmData: Omit<Alarm, 'id' | 'snoozeCount'>,
    editingId?: string
  ) => {
    if (editingId) {
      setAlarms(prev =>
        prev.map(a => (a.id === editingId ? { ...a, ...alarmData } : a))
      );
      showToast(t.toastAlarmSaved);
    } else {
      const newAlarm: Alarm = {
        ...alarmData,
        id: `alarm-${Date.now()}`,
        snoozeCount: 0
      };
      setAlarms(prev => [...prev, newAlarm]);
      showToast(t.toastAlarmSaved);
    }
  };

  // Toggle alarm enabled
  const handleToggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
    triggerHaptic('light');
  };

  // Delete alarm
  const handleDeleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
    showToast(settings.language === 'vi' ? 'Đã xóa báo thức' : 'Alarm deleted');
    triggerHaptic('medium');
  };

  // Trigger test alarm immediately
  const handleTriggerTest = (alarmToTest?: Alarm) => {
    const target =
      alarmToTest ||
      alarms[0] || {
        id: 'test-alarm',
        time: '07:00',
        label: settings.language === 'vi' ? 'Chuông thử nghiệm tốc độ cao' : 'High-speed test alarm',
        enabled: true,
        days: [0, 1, 2, 3, 4, 5, 6],
        snoozeFee: settings.currency === 'USD' ? 5 : 50000,
        currency: settings.currency,
        snoozeCount: 0,
        soundTone: 'nuclear',
        mathChallenge: true
      };

    setActiveRingingAlarm(target);
  };

  // User wakes up successfully (Free!)
  const handleWakeUpSuccess = (_alarm: Alarm) => {
    setActiveRingingAlarm(null);
    setStats(prev => ({
      ...prev,
      totalOnTimeCount: prev.totalOnTimeCount + 1,
      currentStreak: prev.currentStreak + 1
    }));
    showToast(t.toastWokeUp);
  };

  // User snoozes: Paid via Apple Pay / Google Pay!
  const handleSnoozeConfirmed = (alarm: Alarm, roastMsg: string) => {
    const fee = alarm.snoozeFee;
    const isUSD = alarm.currency === 'USD';

    const newRecord: SnoozeRecord = {
      id: `record-${Date.now()}`,
      alarmId: alarm.id,
      alarmLabel: alarm.label,
      timestamp: Date.now(),
      fee,
      currency: alarm.currency,
      snoozeCountThisSession: 1,
      roastMessage: roastMsg
    };

    setRecords(prev => [...prev, newRecord]);
    setStats(prev => ({
      ...prev,
      totalPenaltyUSD: isUSD ? prev.totalPenaltyUSD + fee : prev.totalPenaltyUSD,
      totalPenaltyVND: !isUSD ? prev.totalPenaltyVND + fee : prev.totalPenaltyVND,
      totalSnoozeCount: prev.totalSnoozeCount + 1,
      currentStreak: 0
    }));

    // Auto close ringing alarm overlay to let user sleep
    setActiveRingingAlarm(null);

    const feeText = isUSD ? `$${fee.toFixed(2)}` : `${fee.toLocaleString('vi-VN')} đ`;
    showToast(t.toastPaid.replace('{fee}', feeText));

    // Reschedule ringing in 5 minutes
    setTimeout(() => {
      setActiveRingingAlarm(alarm);
    }, 5 * 60 * 1000);
  };

  const handleResetLedger = () => {
    setRecords([]);
    setStats(prev => ({
      ...prev,
      totalPenaltyUSD: 0,
      totalPenaltyVND: 0,
      totalSnoozeCount: 0,
      totalOnTimeCount: 0,
      currentStreak: 0,
      worstDay: 'Chưa có'
    }));
    showToast(t.toastReset);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setIsSettingsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col pb-24 selection:bg-red-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-neutral-900/95 border border-neutral-700 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce-short flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        totalPenaltyUSD={stats.totalPenaltyUSD}
        totalPenaltyVND={stats.totalPenaltyVND}
        currency={settings.currency}
        language={settings.language}
        onToggleLanguage={handleToggleLanguage}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTriggerTestAlarm={() => handleTriggerTest()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4">
        {/* PWA Install Promo Banner if available */}
        {deferredPrompt && (
          <div className="my-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-red-400" />
              <p className="text-xs text-neutral-300">
                {settings.language === 'vi' ? 'Cài ứng dụng ra màn hình chính để dùng tiện hơn!' : 'Install app to home screen for quick access!'}
              </p>
            </div>
            <button
              onClick={handleInstallPWA}
              className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all whitespace-nowrap"
            >
              {settings.language === 'vi' ? 'Cài ngay' : 'Install'}
            </button>
          </div>
        )}

        {/* Live Clock Display */}
        <ClockDisplay alarms={alarms} language={settings.language} />

        {/* Minimalist Bold Value Proposition Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-white">
                {settings.currency === 'USD' ? '$5.00' : '50.000 đ'} / {settings.language === 'vi' ? 'Lượt Bấm Snooze' : 'Per Snooze'}
              </p>
              <p className="text-[11px] text-neutral-400">
                {t.snoozeDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Alarm List Header */}
        <div className="flex items-center justify-between mb-3 mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            {t.alarmList} ({alarms.length})
          </h2>
          <button
            onClick={() => {
              setEditingAlarm(null);
              setIsAlarmModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addAlarm}</span>
          </button>
        </div>

        {/* Alarm Cards */}
        {alarms.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 my-6">
            <Clock className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">{t.noAlarms}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {t.createFirstAlarm}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alarms.map(alarm => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                language={settings.language}
                onToggle={handleToggleAlarm}
                onEdit={a => {
                  setEditingAlarm(a);
                  setIsAlarmModalOpen(true);
                }}
                onDelete={handleDeleteAlarm}
                onTriggerNow={a => handleTriggerTest(a)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => {
          setIsAlarmModalOpen(false);
          setEditingAlarm(null);
        }}
        onSave={handleSaveAlarm}
        editingAlarm={editingAlarm}
        defaultCurrency={settings.currency}
        language={settings.language}
      />

      <DebtLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        stats={stats}
        records={records}
        currency={settings.currency}
        language={settings.language}
        onResetLedger={handleResetLedger}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* Active Ringing Alarm Overlay */}
      {activeRingingAlarm && (
        <ActiveAlarmOverlay
          alarm={activeRingingAlarm}
          settings={settings}
          onWakeUpSuccess={handleWakeUpSuccess}
          onSnoozeConfirmed={handleSnoozeConfirmed}
        />
      )}
    </div>
  );
}

export default App;
