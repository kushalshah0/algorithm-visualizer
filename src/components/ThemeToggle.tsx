import { useTheme, type ThemeMode } from '../context/ThemeContext';

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function iconFor(value: ThemeMode, className: string) {
  switch (value) {
    case 'light':
      return <SunIcon className={className} />;
    case 'dark':
      return <MoonIcon className={className} />;
    case 'system':
      return <MonitorIcon className={className} />;
  }
}

export function ThemeToggle() {
  const { mode, resolved, setMode } = useTheme();

  // Compute which index is active to position the pill
  const activeIndex = modes.findIndex((m) => m.value === mode);

  return (
    <div className="relative flex items-center gap-0.5 p-1 rounded-xl bg-gray-200/80 dark:bg-gray-800/70 border border-gray-300/60 dark:border-gray-700/50 backdrop-blur-sm">
      {/* Animated pill background */}
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-gray-600 shadow-md transition-all duration-300 ease-out"
        style={{
          width: `calc((100% - 8px) / 3)`,
          left: `calc(4px + ${activeIndex} * ((100% - 8px) / 3))`,
        }}
      />

      {modes.map((m) => {
        const isActive = mode === m.value;
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            title={`${m.label} theme${m.value === 'system' ? ` (currently ${resolved})` : ''}`}
            className={`
              relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-colors duration-200 cursor-pointer
              ${isActive
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }
            `}
          >
            {iconFor(m.value, 'w-3.5 h-3.5')}
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
