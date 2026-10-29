export function canBook({ start, end, now, blocked, bookings }) {
  if (blocked) return false;                 // AC3
  if (start >= end) return false;            // AC1
  if (start <= now) return false;            // AC1: прошлое / начало «сейчас»
  if (end > 1440) return false;              // AC1: за пределами дня
  if (end - start > 120) return false;       // AC2
  // AC4: пересечение только если интервалы реально перекрываются
  return !bookings.some(b => start < b.end && end > b.start);
}