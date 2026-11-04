import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { minutesToLabel } from '@/lib/utils';
import { MAX_BOOKING_MIN, MAX_TIME } from '@/lib/availability';

interface BookingFormProps {
  currentTime: number;
  setCurrentTime: (v: number) => void;
  start: number;
  setStart: (v: number) => void;
  end: number;
  setEnd: (v: number) => void;
  onCheck: () => void;
  disabled?: boolean;
}

export default function BookingForm({
  currentTime,
  setCurrentTime,
  start,
  setStart,
  end,
  setEnd,
  onCheck,
  disabled = false,
}: BookingFormProps) {
  const duration = end - start;
  const exceedsMax = duration > MAX_BOOKING_MIN;

  return (
    <div>
      {/* Current time */}
      <TimeField
        label="Current time"
        value={currentTime}
        onChange={setCurrentTime}
        min={0}
        max={MAX_TIME}
        disabled={disabled}
      />
      <p className="text-xs text-slate-400 mt-1 mb-4">
        {minutesToLabel(currentTime)} ({currentTime} min)
      </p>

      {/* Start / End row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <TimeField
            label="Start time"
            value={start}
            onChange={setStart}
            min={0}
            max={MAX_TIME}
            disabled={disabled}
          />
          <p className="text-xs text-slate-400 mt-1">{minutesToLabel(start)}</p>
        </div>
        <div>
          <TimeField
            label="End time"
            value={end}
            onChange={setEnd}
            min={0}
            max={MAX_TIME}
            disabled={disabled}
          />
          <p className="text-xs text-slate-400 mt-1">{minutesToLabel(end)}</p>
        </div>
      </div>

      {/* Duration badge */}
      <div className="flex items-center gap-2 mb-5 text-xs">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500">
          Duration: <strong className="text-slate-700">{duration}</strong> min
        </span>
        {exceedsMax && (
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
            Exceeds {MAX_BOOKING_MIN} min
          </span>
        )}
      </div>

      {/* Check button */}
      <button
        onClick={onCheck}
        disabled={disabled}
        data-testid="check-availability-button"
        className={`w-full font-semibold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
          disabled
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white'
        }`}
      >
        Check Availability
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Reusable TimeField component ── */
interface TimeFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}

export function TimeField({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
}: TimeFieldProps) {
  const inputId = `time-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-slate-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="number"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onChange(0);
              return;
            }
            const n = parseInt(raw, 10);
            if (!Number.isNaN(n)) {
              onChange(Math.min(Math.max(n, min), max));
            }
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all disabled:bg-slate-100 disabled:text-slate-400"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          min
        </span>
      </div>
    </div>
  );
}
