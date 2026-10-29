import { Building2, Github, Clock } from 'lucide-react';
import RoomChecker from '@/components/RoomChecker';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                Smart Campus
              </h1>
              <p className="text-xs text-slate-500">Room Availability Checker</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Times in minutes after midnight
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
            Find an open room
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
            Pick a room, set the current time, and enter your desired start and
            end times (in minutes after midnight, e.g. 600&nbsp;=&nbsp;10:00 AM).
            We'll check if the slot is free — no booking data is changed.
          </p>
        </div>

        <RoomChecker />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between text-xs text-slate-400">
          <span>Smart Campus Prototype — fictional sample data</span>
          <span className="flex items-center gap-1">
            <Github className="w-3.5 h-3.5" />
            UI Prototype
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
