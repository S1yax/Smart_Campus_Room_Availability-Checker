import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoomChecker from '@/components/RoomChecker';

describe('RoomChecker UI Integration & Behavior Tests', () => {
  it('renders room catalog and filter controls', () => {
    render(<RoomChecker />);

    expect(screen.getByText('Filter Rooms')).toBeInTheDocument();
    expect(screen.getAllByText('Study Room A').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Study Room B')).toBeInTheDocument();
    expect(screen.getByText('Engineering Lab')).toBeInTheDocument();
  });

  it('F1 & F4: filters rooms by capacity and displays empty state when no match is found', () => {
    render(<RoomChecker />);

    const capacityInput = screen.getByPlaceholderText(/e\.g\. 10/i);

    // Filter to capacity 25: Study Room A (8) and Study Room B (6) should be filtered out
    fireEvent.change(capacityInput, { target: { value: '25' } });

    expect(screen.queryByTestId('room-select-lib-101')).not.toBeInTheDocument();
    expect(screen.queryByTestId('room-select-lib-102')).not.toBeInTheDocument();
    expect(screen.getByTestId('room-select-eng-205')).toBeInTheDocument(); // cap 30

    // Filter to capacity 500: No rooms match, empty state is displayed (F4)
    fireEvent.change(capacityInput, { target: { value: '500' } });

    expect(screen.getByTestId('empty-catalog-state')).toBeInTheDocument();
    expect(screen.getByText('No matching rooms found')).toBeInTheDocument();
  });

  it('F5: switching room updates selection and refreshes availability result for chosen room bookings', () => {
    render(<RoomChecker />);

    // Default room is Study Room A (lib-101), which has a booking at 600-660.
    const startInput = screen.getByLabelText('Start time');
    const endInput = screen.getByLabelText('End time');

    fireEvent.change(startInput, { target: { value: '600' } });
    fireEvent.change(endInput, { target: { value: '660' } });

    const checkButton = screen.getByTestId('check-availability-button');
    fireEvent.click(checkButton);

    // Study Room A has booking at 600-660, so it should report Unavailable
    const resultCard = screen.getByTestId('availability-result');
    expect(resultCard).toHaveTextContent('Unavailable');
    expect(resultCard).toHaveTextContent('Overlaps an existing booking');

    // Now switch room to Study Room B (lib-102), which has bookings only at 720-780 (free at 600-660)
    const roomBButton = screen.getByTestId('room-select-lib-102');
    fireEvent.click(roomBButton);

    // F5: changing room refreshes the availability result appropriately using chosen room's bookings
    expect(screen.getByTestId('availability-result')).toHaveTextContent('Available');
    expect(screen.getByTestId('availability-result')).toHaveTextContent('This time slot is open');
  });
});
