import React from 'react';
import { Play, Trash2, Edit3, Calculator, Volume2 } from 'lucide-react';
import { Alarm } from '../types';
import { Language } from '../services/i18n';

interface AlarmCardProps {
  alarm: Alarm;
  language: Language;
  onToggle: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
  onTriggerNow: (alarm: Alarm) => void;
}

const DAY_NAMES_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  language,
  onToggle,
  onEdit,
  onDelete,
  onTriggerNow
}) => {
  const feeDisplay =
    alarm.currency === 'USD'
      ? `$${alarm.snoozeFee}`
      : `${(alarm.snoozeFee / 1000).toFixed(0)}k đ`;

  const dayNames = language === 'vi' ? DAY_NAMES_VI : DAY_NAMES_EN;
  const isEveryday = alarm.days.length === 7;
  const isWeekdays = alarm.days.length === 5 && !alarm.days.includes(0) && !alarm.days.includes(6);

  let repeatSummary = language === 'vi' ? 'Một lần' : 'Once';
  if (isEveryday) repeatSummary = language === 'vi' ? 'Mỗi ngày' : 'Every day';
  else if (isWeekdays) repeatSummary = language === 'vi' ? 'T2 - T6' : 'Mon - Fri';
  else if (alarm.days.length > 0) {
    repeatSummary = alarm.days.map(d => dayNames[d]).join(', ');
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-200 ${
        alarm.enabled
          ? 'bg-neutral-900 border-neutral-800 shadow-xl'
          : 'bg-neutral-900/40 border-neutral-900/60 opacity-50'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left Column: Time & Big Price Badge */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white">
                {alarm.time}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black bg-red-500/20 text-red-400 border border-red-500/30">
                {feeDisplay} / Snooze
              </span>
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-neutral-200 mt-1 line-clamp-1">
              {alarm.label || (language === 'vi' ? 'Báo thức' : 'Alarm')}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-neutral-400">
              <span className="px-2 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 font-medium">
                {repeatSummary}
              </span>

              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-800 text-neutral-300">
                <Volume2 className="w-3 h-3 text-amber-400" />
                <span className="capitalize">{alarm.soundTone}</span>
              </span>

              {alarm.mathChallenge && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  <Calculator className="w-3 h-3" />
                  <span>{language === 'vi' ? 'Giải toán' : 'Math check'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Toggle Switch */}
          <div className="flex flex-col items-end gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={alarm.enabled}
                onChange={() => onToggle(alarm.id)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* Bottom Actions Toolbar */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <button
            onClick={() => onTriggerNow(alarm)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold transition-colors active:scale-95"
          >
            <Play className="w-3 h-3 fill-amber-400" />
            <span>{language === 'vi' ? 'Thử Kêu' : 'Test Ring'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(alarm)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title={language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(alarm.id)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title={language === 'vi' ? 'Xóa' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
