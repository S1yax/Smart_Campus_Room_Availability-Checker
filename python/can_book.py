def can_book(start: int, end: int, now: int, blocked: bool,
             existing: list[tuple[int, int]]) -> bool:
    """Return True if the interval [start, end) is bookable.

    Half-open: touching endpoints are allowed (e.g. 660-720 next to 600-660).
    `existing` is never mutated.
    """
    # AC1 — valid interval and start strictly after current time
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2 — duration must not exceed 120 minutes
    if end - start > 120:
        return False

    # AC3 — blocked room can never be booked
    if blocked:
        return False

    # AC4 — reject overlap with any existing booking (half-open, touching ok)
    for b_start, b_end in existing:
        if start < b_end and b_start < end:
            return False

    # AC5 — pure boolean decision, no data modified
    return True
