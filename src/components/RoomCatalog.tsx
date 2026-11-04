import React from 'react';
import { Ban, DoorOpen, MapPin, Users, Tag, AlertCircle } from 'lucide-react';
import type { Room } from '@/lib/types';

interface RoomCatalogProps {
  rooms: Room[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onResetFilters: () => void;
}

export default function RoomCatalog({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onResetFilters,
}: RoomCatalogProps) {
  // F4: Clear empty state when no rooms match
  if (rooms.length === 0) {
    return (
      <div
        data-testid="empty-catalog-state"
        className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center bg-slate-50"
      >
        <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 mb-1">
          No matching rooms found
        </h4>
        <p className="text-xs text-slate-500 mb-3 max-w-xs mx-auto">
          No rooms meet the selected attendee count or equipment criteria. Try
          reducing requirements.
        </p>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-5 max-h-[380px] overflow-y-auto pr-1">
      {rooms.map((r) => {
        const active = r.id === selectedRoomId;
        return (
          <button
            key={r.id}
            data-testid={`room-select-${r.id}`}
            onClick={() => onSelectRoom(r.id)}
            className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
              active
                ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200 shadow-sm'
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
                    {r.capacity} seats
                  </span>
                </div>

                {/* Equipment tags */}
                {r.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {r.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                      >
                        <Tag className="w-2.5 h-2.5 opacity-60" />
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
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
  );
}
