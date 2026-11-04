import React from 'react';
import { Users, Filter, RotateCcw, CheckSquare, Square } from 'lucide-react';
import type { FilterCriteria } from '@/lib/types';
import { ALL_EQUIPMENT_OPTIONS } from '@/lib/filter';

interface FilterControlsProps {
  criteria: FilterCriteria;
  onChange: (criteria: FilterCriteria) => void;
  totalRooms: number;
  matchedCount: number;
}

export default function FilterControls({
  criteria,
  onChange,
  totalRooms,
  matchedCount,
}: FilterControlsProps) {
  function handleCapacityChange(val: number) {
    onChange({
      ...criteria,
      minCapacity: Math.max(0, val),
    });
  }

  function toggleEquipment(item: string) {
    const exists = criteria.requiredEquipment.includes(item);
    const updated = exists
      ? criteria.requiredEquipment.filter((x) => x !== item)
      : [...criteria.requiredEquipment, item];
    onChange({
      ...criteria,
      requiredEquipment: updated,
    });
  }

  function handleReset() {
    onChange({
      minCapacity: 0,
      requiredEquipment: [],
    });
  }

  const isFiltered = criteria.minCapacity > 0 || criteria.requiredEquipment.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-800">Filter Rooms</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {matchedCount} of {totalRooms} rooms matching
          </span>
        </div>
        {isFiltered && (
          <button
            onClick={handleReset}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* F1: Capacity filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Minimum Required Capacity (Attendees)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={200}
              value={criteria.minCapacity === 0 ? '' : criteria.minCapacity}
              placeholder="e.g. 10 (or 0 for any)"
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                handleCapacityChange(Number.isNaN(val) ? 0 : val);
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all placeholder:text-slate-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              seats
            </span>
          </div>
        </div>

        {/* F2: Required Equipment Multi-Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Required Equipment (must contain ALL)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_EQUIPMENT_OPTIONS.map((item) => {
              const selected = criteria.requiredEquipment.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleEquipment(item)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-sky-50 border-sky-400 text-sky-700 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {selected ? (
                    <CheckSquare className="w-3 h-3 text-sky-600" />
                  ) : (
                    <Square className="w-3 h-3 text-slate-400" />
                  )}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
