import { useState, useMemo } from 'react';
import {
  Clock,
  DoorOpen,
  Ban,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  MapPin,
} from 'lucide-react';
import { ROOMS } from '@/lib/data';
import type { CheckResult } from '@/lib/types';
import { checkAvailability, suggestNextSlot } from '@/lib/availability';
import { minutesToLabel } from '@/lib/utils';
import Timeline from '@/components/Timeline';

const DEFAULT_CURRENT = 540; // 9:00 AM

export default function RoomChecker() {
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [currentTime, setCurrentTime] = useState(DEFAULT_CURRENT);
  const [start, setStart] = useState(660); // 11:00 AM
  const [end, setEnd] = useState(720); // 12:00 PM
  const [result, setResult] = useState<CheckResult | null>(null);

  const room = useMemo(
    () => ROOMS.find((r) => r.id === roomId) ?? ROOMS[0],
    [roomId]
  );

  function handleCheck() {
    const res = checkAvailability(room, start, end, currentTime);
    setResult(res);
  }

  function applySuggestedSlot(s: number, e: number) {
    setStart(s);
    setEnd(e);
    setResult(null);
  }

  const suggestion = useMemo(() => {
    if (!room.blocked) {
      const dur = Math.min(end - start, 60);
      if (dur > 0) {
        return suggestNextSlot(room, currentTime, dur);
      }
    }
    return null;
  }, [room, currentTime, start, end]);

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      {/* ───────────── Form column ───────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Check a room</h2>
        <p className="text-sm text-slate-500 mb-5">
          Enter an interval in minutes after midnight to see if the room is free.
        </p>

        {/* Room selector */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Room
        </label>
        <div className="space-y-2 mb-5">
          {ROOMS.map((r) => {
            const active = r.id === roomId;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRoomId(r.id);
                  setResult(null);
                }}
                className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                  active
                    ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {r.blocked ? (
                        <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <DoorOpen className="w-4 h-4 text-sky-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 text-sm truncate">
                        {r.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {r.building}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3" />
                        {r.capacity}
                      </span>
                    </div>
                  </div>
                  {r.blocked && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                      Blocked
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current time */}
        <TimeField
          label="Current time"
          value={currentTime}
          onChange={(v) => {
            setCurrentTime(v);
            setResult(null);
          }}
          min={0}
          max={1440}
        />
        <p className="text-xs text-slate-400 mt-1 mb-4">
          {minutesToLabel(currentTime)} ({currentTime} min)
        </p>

        {/* Start / End row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <TimeField
              label="Start"
              value={start}
              onChange={(v) => {
                setStart(v);
                setResult(null);
              }}
              min={0}
              max={1440}
            />
            <p className="text-xs text-slate-400 mt-1">
              {minutesToLabel(start)}
            </p>
          </div>
          <div>
            <TimeField
              label="End"
              value={end}
              onChange={(v) => {
                setEnd(v);
                setResult(null);
              }}
              min={0}
              max={1440}
            />
            <p className="text-xs text-slate-400 mt-1">
              {minutesToLabel(end)}
            </p>
          </div>
        </div>

        {/* Duration badge */}
        <div className="flex items-center gap-2 mb-5 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">
            Duration: <strong className="text-slate-700">{end - start}</strong> min
          </span>
          {end - start > 120 && (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              Exceeds 120 min
            </span>
          )}
        </div>

        {/* Check button */}
        <button
          onClick={handleCheck}
          className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          Check Availability
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ───────────── Result / detail column ───────────── */}
      <div className="space-y-6">
        {/* Room detail card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{room.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {room.building}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Seats {room.capacity}
                </span>
              </div>
            </div>
            {room.blocked ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                <Ban className="w-4 h-4" />
                Blocked
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <DoorOpen className="w-4 h-4" />
                Active
              </span>
            )}
          </div>

          {/* Timeline */}
          <Timeline
            room={room}
            candidateStart={result ? start : null}
            candidateEnd={result ? end : null}
            currentTime={currentTime}
          />
        </div>

        {/* Result card */}
        {result && (
          <div
            className={`rounded-2xl border-2 p-6 transition-all ${
              result.status === 'available'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-rose-300 bg-rose-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {result.status === 'available' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600" />
              )}
              <div>
                <h3
                  className={`text-2xl font-bold ${
                    result.status === 'available'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {result.status === 'available' ? 'Available' : 'Unavailable'}
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

            {result.status === 'available' && (
              <p className="text-sm text-emerald-700 mt-3 font-medium">
                This time slot is open. No existing bookings conflict.
              </p>
            )}

            {result.status === 'unavailable' &&
              suggestion &&
              !room.blocked && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    Suggested next slot ({suggestion.end - suggestion.start} min):
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    {suggestion.start}–{suggestion.end} ({' '}
                    {minutesToLabel(suggestion.start)} –{' '}
                    {minutesToLabel(suggestion.end)})
                  </p>
                  <button
                    onClick={() =>
                      applySuggestedSlot(suggestion.start, suggestion.end)
                    }
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    Use this slot
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
          </div>
        )}

        {!result && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <p className="text-slate-400 text-sm">
              Fill in the times and press <strong>Check Availability</strong> to
              see the result.
            </p>
          </div>
        )}

        {/* Existing bookings list */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Existing bookings for {room.name}
          </h3>
          {room.bookings.length === 0 ? (
            <p className="text-sm text-slate-400">
              {room.blocked
                ? 'Room is blocked — no bookings are accepted.'
                : 'No existing bookings.'}
            </p>
          ) : (
            <div className="space-y-2">
              {room.bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5"
                >
                  <span className="font-medium text-slate-700 text-sm">
                    {b.label}
                  </span>
                  <span className="text-sm text-slate-500 font-mono">
                    {b.start}–{b.end} ({minutesToLabel(b.start)} –{' '}
                    {minutesToLabel(b.end)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable time field ── */
interface TimeFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}

function TimeField({ label, value, onChange, min, max }: TimeFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          min
        </span>
      </div>
    </div>
  );
}
