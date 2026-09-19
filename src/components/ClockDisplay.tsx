import React, { useState, useEffect } from 'react';
import { Clock, Zap, CreditCard } from 'lucide-react';
import { Alarm } from '../types';
import { Language, TRANSLATIONS } from '../services/i18n';

interface ClockDisplayProps {
  alarms: Alarm[];
  language: Language;
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({ alarms, language }) => {
  const [time, setTime] = useState(new Date());
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const dateString = time.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeAlarms = alarms.filter(a => a.enabled);
  let nextAlarmText = language === 'vi' ? 'Chưa có báo thức nào bật' : 'No active alarms';

  if (activeAlarms.length > 0) {
    const currentTotalMinutes = time.getHours() * 60 + time.getMinutes();
    let minDiff = Infinity;
    let nextAlarm: Alarm | null = null;

    activeAlarms.forEach(alarm => {
      const [h, m] = alarm.time.split(':').map(Number);
      const alarmTotalMinutes = h * 60 + m;
      let diff = alarmTotalMinutes - currentTotalMinutes;
      if (diff <= 0) diff += 24 * 60;
      if (diff < minDiff) {
        minDiff = diff;
        nextAlarm = alarm;
      }
    });

    if (nextAlarm) {
      const diffHours = Math.floor(minDiff / 60);
      const diffMinutes = minDiff % 60;
      nextAlarmText = `${t.nextAlarm}: ${(nextAlarm as Alarm).time} (${diffHours > 0 ? `${diffHours}${t.leftHours} ` : ''}${diffMinutes}${t.leftMinutes})`;
    }
  }

  return (
    <div className="w-full my-4">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/90 p-6 border border-neutral-800 shadow-2xl text-center">
        {/* Date line */}
        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span>{dateString}</span>
        </div>

        {/* Big Digital Clock */}
        <div className="flex items-baseline justify-center font-mono font-black tracking-tight text-white select-none">
          <span className="text-7xl sm:text-8xl font-black tracking-tighter">
            {hours}:{minutes}
          </span>
          <span className="text-2xl sm:text-3xl text-red-500 font-bold ml-1.5 w-10 text-left">
            :{seconds}
          </span>
        </div>

        {/* Next Alarm Pill */}
        <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{nextAlarmText}</span>
        </div>

        {/* Big Apple Pay / Google Pay Highlight */}
        <div className="mt-4 pt-3.5 border-t border-neutral-800 flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
          <CreditCard className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="tracking-wide font-medium">
            {t.bannerRule}
          </span>
        </div>
      </div>
    </div>
  );
};
