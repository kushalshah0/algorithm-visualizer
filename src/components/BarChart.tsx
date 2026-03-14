import { SortStep } from '../types';

interface BarChartProps {
  step: SortStep;
  maxValue: number;
}

function getBarStyle(index: number, step: SortStep) {
  const { comparing, swapping, sorted, pivot, merging } = step;

  if (swapping.includes(index))
    return {
      bg: 'bg-rose-500',
      glow: 'bar-glow-rose',
      label: 'Swapping',
    };
  if (comparing.includes(index))
    return {
      bg: 'bg-amber-500 dark:bg-amber-400',
      glow: 'bar-glow-amber',
      label: 'Comparing',
    };
  if (pivot !== undefined && pivot === index)
    return {
      bg: 'bg-purple-500',
      glow: 'bar-glow-purple',
      label: 'Pivot',
    };
  if (merging?.includes(index))
    return {
      bg: 'bg-sky-500 dark:bg-sky-400',
      glow: 'bar-glow-sky',
      label: 'Merging',
    };
  if (sorted.includes(index))
    return {
      bg: 'bg-emerald-500',
      glow: '',
      label: 'Sorted',
    };
  return {
    bg: 'bg-indigo-500 dark:bg-indigo-400',
    glow: '',
    label: '',
  };
}

export function BarChart({ step, maxValue }: BarChartProps) {
  const { array } = step;
  const n = array.length;
  const gapPx = n > 40 ? 1 : n > 25 ? 2 : 3;

  return (
    <div
      className="flex items-end justify-center w-full h-80 md:h-96 px-2 pb-2"
      style={{ gap: `${gapPx}px` }}
    >
      {array.map((value, index) => {
        const heightPercent = (value / maxValue) * 100;
        const { bg, glow, label } = getBarStyle(index, step);

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-end relative group"
            style={{ flex: 1, maxWidth: n > 30 ? '20px' : '40px' }}
          >
            {/* Tooltip on hover */}
            <div
              className="absolute -top-11 opacity-0 group-hover:opacity-100 transition-opacity duration-150
                         bg-gray-900 dark:bg-gray-800 text-white text-[11px] px-2.5 py-1 rounded-md
                         whitespace-nowrap z-10 pointer-events-none shadow-lg
                         after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
                         after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-800"
            >
              {value}
              {label ? ` · ${label}` : ''}
            </div>

            {/* Value label */}
            {n <= 25 && (
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-0.5 select-none">
                {value}
              </span>
            )}

            {/* Bar */}
            <div
              className={`w-full rounded-t-sm transition-all duration-150 ease-in-out ${bg} ${glow}`}
              style={{ height: `${heightPercent}%`, minHeight: '2px' }}
            />
          </div>
        );
      })}
    </div>
  );
}
