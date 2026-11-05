import React, { useState, useMemo, useEffect } from 'react';
import { DoorOpen, Ban, MapPin, Users, Tag, Clock } from 'lucide-react';
import { ROOMS } from '@/lib/data';
import type { CheckResult, FilterCriteria } from '@/lib/types';
import { checkAvailability, suggestNextSlot } from '@/lib/availability';
import { SUGGESTION_LENGTH_MIN } from '@/lib/booking-rules'; // CHANGED: new import
import { filterRooms } from '@/lib/filter';
import { minutesToLabel } from '@/lib/utils';
import Timeline from '@/components/Timeline';
import FilterControls from '@/components/FilterControls';
import RoomCatalog from '@/components/RoomCatalog';
import BookingForm from '@/components/BookingForm';
import AvailabilityResultCard from '@/components/AvailabilityResultCard';

const DEFAULT_CURRENT = 540; // 09:00 AM
const DEFAULT_START = 660;   // 11:00 AM
const DEFAULT_END = 720;     // 12:00 PM

export default function RoomChecker() {
  // Filter state
  const [criteria, setCriteria] = useState<FilterCriteria>({
    minCapacity: 0,
    requiredEquipment: [],
  });

  // Filtered rooms list
  const filteredRooms = useMemo(
    () => filterRooms(ROOMS, criteria),
    [criteria]
  );

  // Selected room state (default to first room in catalog)
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0].id);

  // Availability inputs
  const [currentTime, setCurrentTime] = useState<number>(DEFAULT_CURRENT);
  const [start, setStart] = useState<number>(DEFAULT_START);
  const [end, setEnd] = useState<number>(DEFAULT_END);
  const [result, setResult] = useState<CheckResult | null>(null);

  // Determine active room: prefer selectedRoomId if present in filteredRooms,
  // else pick first filtered room, or fallback to first room overall
  const activeRoom = useMemo(() => {
    const foundInFiltered = filteredRooms.find((r) => r.id === selectedRoomId);
    if (foundInFiltered) return foundInFiltered;
    if (filteredRooms.length > 0) return filteredRooms[0];
    return ROOMS.find((r) => r.id === selectedRoomId) ?? ROOMS[0];
  }, [filteredRooms, selectedRoomId]);

  // If the active room changed due to filtering, keep selectedRoomId synchronized
  useEffect(() => {
    if (filteredRooms.length > 0 && !filteredRooms.some((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(filteredRooms[0].id);
    }
  }, [filteredRooms, selectedRoomId]);

  // F5: Changing the selected room refreshes availability result appropriately
  function handleSelectRoom(newRoomId: string) {
    setSelectedRoomId(newRoomId);
    const targetRoom = ROOMS.find((r) => r.id === newRoomId);
    if (targetRoom && result !== null) {
      // Re-evaluate check against the newly selected room's own bookings
      const refreshed = checkAvailability(targetRoom, start, end, currentTime);
      setResult(refreshed);
    }
  }

  function handleCheck() {
    if (!activeRoom) return;
    const res = checkAvailability(activeRoom, start, end, currentTime);
    setResult(res);
  }

  function handleResetFilters() {
    setCriteria({ minCapacity: 0, requiredEquipment: [] });
  }

  function handleApplySlot(s: number, e: number) {
    setStart(s);
    setEnd(e);
    // When applying suggested slot, re-check immediately
    if (activeRoom) {
      setResult(checkAvailability(activeRoom, s, e, currentTime));
    }
  }

  const suggestion = useMemo(() => {
    if (!activeRoom || activeRoom.blocked) {
      return null;
    }
    const dur = Math.min(end - start, SUGGESTION_LENGTH_MIN); // CHANGED: was 60
    if (dur > 0) {
      return suggestNextSlot(activeRoom, currentTime, dur);
    }
    return null;
  }, [activeRoom, currentTime, start, end]);

  return (
    <div className="space-y-6">
      {/* ───────────── Filter Section ───────────── */}
      <FilterControls
        criteria={criteria}
        onChange={setCriteria}
        totalRooms={ROOMS.length}
        matchedCount={filteredRooms.length}
      />

      {/* ───────────── Main Workspace Grid ───────────── */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Left Column: Room Selection Catalog & Booking Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Select a Room</h2>
            <p className="text-sm text-slate-500 mb-4">
              Choose from filtered rooms and configure your time interval.
            </p>

            <RoomCatalog
              rooms={filteredRooms}
              selectedRoomId={activeRoom?.id ?? ''}
              onSelectRoom={handleSelectRoom}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Time Interval</h3>
            <BookingForm
              currentTime={currentTime}
              setCurrentTime={(t) => {
                setCurrentTime(t);
                setResult(null);
              }}
              start={start}
              setStart={(s) => {
                setStart(s);
                setResult(null);
              }}
              end={end}
              setEnd={(e) => {
                setEnd(e);
                setResult(null);
              }}
              onCheck={handleCheck}
              disabled={filteredRooms.length === 0}
            />
          </div>
        </div>

        {/* Right Column: Room Details, Timeline & Availability Status */}
        <div className="space-y-6">
          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
              <p className="text-slate-500 text-base font-medium">
                No rooms available to inspect for the current filters.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Adjust or reset your capacity and equipment filters on the left.
              </p>
            </div>
          ) : (
            <>
              {/* Room Detail Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {activeRoom.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {activeRoom.building}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Seats {activeRoom.capacity}
                      </span>
                    </div>

                    {/* Equipment list */}
                    {activeRoom.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {activeRoom.equipment.map((eq) => (
                          <span
                            key={eq}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            <Tag className="w-3 h-3 text-slate-400" />
                            {eq}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeRoom.blocked ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                      <Ban className="w-4 h-4" />
                      Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <DoorOpen className="w-4 h-4" />
                      Active
                    </span>
                  )}
                </div>

                {/* Timeline */}
                <Timeline
                  room={activeRoom}
                  candidateStart={result ? start : null}
                  candidateEnd={result ? end : null}
                  currentTime={currentTime}
                />
              </div>

              {/* Result Card */}
              <AvailabilityResultCard
                result={result}
                start={start}
                end={end}
                isBlocked={activeRoom.blocked}
                suggestion={suggestion}
                onApplySlot={handleApplySlot}
              />

              {/* Existing Bookings List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Existing Bookings for {activeRoom.name}
                </h3>
                {activeRoom.bookings.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    {activeRoom.blocked
                      ? 'Room is blocked — no bookings are accepted.'
                      : 'No existing bookings scheduled.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeRoom.bookings.map((b) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}