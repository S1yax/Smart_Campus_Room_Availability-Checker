import { useMemo } from 'react';
import type { Room } from '@/lib/types';
import { minutesToShortLabel } from '@/lib/utils';

interface TimelineProps {
  room: Room;
  candidateStart: number | null;
  candidateEnd: number | null;
  currentTime: number;
}

const DAY_START = 0;
const DAY_END = 1440;

const HOUR_MARKS = Array.from({ length: 25 }, (_, i) => i * 60);

function pct(min: number): string {
  return `${(min / (DAY_END - DAY_START)) * 100}%`;
}

export default function Timeline({
  room,
  candidateStart,
  candidateEnd,
  currentTime,
}: TimelineProps) {
  const hourMarks = useMemo(() => {
    return HOUR_MARKS.filter((h) => h % 120 === 0);
  }, []);

  const candidateVisible =
    candidateStart !== null &&
    candidateEnd !== null &&
    candidateStart < candidateEnd;

  return (
    <div className="w-full">
      {/* Hour scale */}
      <div className="relative h-5 mb-1">
        {hourMarks.map((h) => (
          <div
            key={h}
            className="absolute -translate-x-1/2 text-[10px] font-medium text-slate-400"
            style={{ left: pct(h) }}
          >
            {minutesToShortLabel(h)}
          </div>
        ))}
      </div>

      {/* Timeline track */}
      <div className="relative h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
        {/* Hour gridlines */}
        {hourMarks.map((h) => (
          <div
            key={`grid-${h}`}
            className="absolute top-0 bottom-0 w-px bg-slate-200"
            style={{ left: pct(h) }}
          />
        ))}

        {/* Existing bookings */}
        {room.bookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-1 bottom-1 rounded bg-sky-200 border border-sky-300 flex items-center justify-center overflow-hidden px-1"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${b.label}: ${b.start}–${b.end}`}
          >
            <span className="text-[9px] font-semibold text-sky-800 truncate">
              {b.label}
            </span>
          </div>
        ))}

        {/* Candidate interval */}
        {candidateVisible && candidateStart !== null && candidateEnd !== null && (
          <div
            className="absolute top-1 bottom-1 rounded border-2 border-dashed flex items-center justify-center"
            style={{
              left: pct(candidateStart),
              width: pct(candidateEnd - candidateStart),
              borderColor: '#0ea5e9',
              background: 'rgba(14,165,233,0.10)',
            }}
            title={`Candidate: ${candidateStart}–${candidateEnd}`}
          >
            <span className="text-[9px] font-bold text-sky-700 truncate">
              {candidateStart}–{candidateEnd}
            </span>
          </div>
        )}

        {/* Current time marker */}
        {currentTime >= DAY_START && currentTime <= DAY_END && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10"
            style={{ left: pct(currentTime) }}
            title={`Now: ${currentTime} min`}
          >
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500" />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-200 border border-sky-300" />
          Existing booking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-dashed border-sky-400" />
          Your request
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-rose-400" />
          Current time
        </span>
      </div>
    </div>
  );
}
