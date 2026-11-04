import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import type { CheckResult } from '@/lib/types';
import { minutesToLabel } from '@/lib/utils';

interface AvailabilityResultCardProps {
  result: CheckResult | null;
  start: number;
  end: number;
  isBlocked: boolean;
  suggestion: { start: number; end: number } | null;
  onApplySlot: (s: number, e: number) => void;
}

export default function AvailabilityResultCard({
  result,
  start,
  end,
  isBlocked,
  suggestion,
  onApplySlot,
}: AvailabilityResultCardProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
        <p className="text-slate-400 text-sm">
          Select your interval and click <strong>Check Availability</strong> to
          test this room.
        </p>
      </div>
    );
  }

  const isAvailable = result.status === 'available';

  return (
    <div
      data-testid="availability-result"
      className={`rounded-2xl border-2 p-6 transition-all ${
        isAvailable
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-rose-300 bg-rose-50'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        {isAvailable ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
        ) : (
          <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
        )}
        <div>
          <h3
            className={`text-2xl font-bold ${
              isAvailable ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </h3>
          <p className="text-sm text-slate-600">
            {start}–{end} ({end - start} min) · {minutesToLabel(start)} –{' '}
            {minutesToLabel(end)}
          </p>
        </div>
      </div>

      {result.reasons.length > 0 && (
        <ul className="space-y-1.5 mt-3">
          {result.reasons.map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-rose-700"
            >
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {result.warnings.map((w, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-amber-700"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      )}

      {isAvailable && (
        <p className="text-sm text-emerald-700 mt-3 font-medium">
          This time slot is open. No existing bookings conflict.
        </p>
      )}

      {!isAvailable && suggestion && !isBlocked && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-1">
            Suggested next slot ({suggestion.end - suggestion.start} min):
          </p>
          <p className="text-sm text-slate-600 mb-3">
            {suggestion.start}–{suggestion.end} ({minutesToLabel(suggestion.start)}{' '}
            – {minutesToLabel(suggestion.end)})
          </p>
          <button
            onClick={() => onApplySlot(suggestion.start, suggestion.end)}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Use this slot
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
