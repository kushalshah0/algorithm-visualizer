import { PlaybackState, SortAlgorithm } from '../types';

interface ControlsProps {
  algorithm: SortAlgorithm;
  onAlgorithmChange: (algo: SortAlgorithm) => void;
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onNewArray: () => void;
}

const algorithms: { id: SortAlgorithm; label: string; complexity: string }[] = [
  { id: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)' },
  { id: 'quick', label: 'Quick Sort', complexity: 'O(n log n)' },
  { id: 'merge', label: 'Merge Sort', complexity: 'O(n log n)' },
];

const speedOptions = [
  { value: 2000, label: '0.5×' },
  { value: 1000, label: '1×' },
  { value: 500, label: '2×' },
  { value: 200, label: '5×' },
  { value: 100, label: '10×' },
  { value: 30, label: '30×' },
];

export function Controls({
  algorithm,
  onAlgorithmChange,
  playbackState,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  currentStep,
  totalSteps,
  onStepChange,
  onNewArray,
}: ControlsProps) {
  const isRunning = playbackState === 'playing';
  const isFinished = playbackState === 'finished';

  const sectionLabel =
    'block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5';

  const secondaryBtn = `
    p-2.5 rounded-xl transition-all duration-200 border cursor-pointer
    bg-white dark:bg-gray-800/50
    text-gray-500 dark:text-gray-400
    border-gray-200 dark:border-gray-700/50
    hover:bg-gray-100 dark:hover:bg-gray-700
    hover:text-gray-800 dark:hover:text-white
    disabled:opacity-30 disabled:cursor-not-allowed
  `;

  return (
    <div className="space-y-6">
      {/* ─── Algorithm Selection ─── */}
      <div>
        <label className={sectionLabel}>Algorithm</label>
        <div className="grid grid-cols-3 gap-2">
          {algorithms.map((algo) => {
            const active = algorithm === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => onAlgorithmChange(algo.id)}
                disabled={isRunning}
                className={`relative px-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/30 scale-[1.02]'
                      : `bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-300
                         border border-gray-200 dark:border-gray-700/50
                         hover:bg-indigo-50 dark:hover:bg-gray-700/70
                         hover:text-indigo-700 dark:hover:text-white
                         hover:border-indigo-200 dark:hover:border-gray-600`
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="block leading-tight">{algo.label}</span>
                <span
                  className={`block text-[10px] mt-0.5 ${
                    active ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {algo.complexity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Playback Controls ─── */}
      <div>
        <label className={sectionLabel}>Playback</label>
        <div className="flex items-center gap-2">
          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={isRunning || currentStep === 0}
            className={secondaryBtn}
            title="Step Backward"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={isRunning ? onPause : onPlay}
            disabled={isFinished}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 cursor-pointer
              ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              }
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                {currentStep > 0 && !isFinished ? 'Resume' : 'Play'}
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={isRunning || currentStep >= totalSteps - 1}
            className={secondaryBtn}
            title="Step Forward"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
            </svg>
          </button>

          {/* Reset */}
          <button onClick={onReset} className={secondaryBtn} title="Reset">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Timeline Slider ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={sectionLabel.replace('mb-2.5', 'mb-0')}>Timeline</label>
          <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
            {currentStep} / {totalSteps - 1}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          disabled={isRunning}
          className="w-full disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>

      {/* ─── Speed Control ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={sectionLabel.replace('mb-2.5', 'mb-0')}>Speed</label>
          <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            {speedOptions.find((s) => s.value === speed)?.label ?? '5×'}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {speedOptions.map((opt) => {
            const active = speed === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSpeedChange(opt.value)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : `bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400
                         border border-gray-200/80 dark:border-gray-700/50
                         hover:bg-indigo-50 dark:hover:bg-gray-700
                         hover:text-indigo-600 dark:hover:text-white`
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Array Size ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={sectionLabel.replace('mb-2.5', 'mb-0')}>Array Size</label>
          <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
            {arraySize} elements
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          value={arraySize}
          onChange={(e) => onArraySizeChange(Number(e.target.value))}
          disabled={isRunning}
          className="w-full disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>

      {/* ─── Generate New Array ─── */}
      <button
        onClick={onNewArray}
        disabled={isRunning}
        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer
                   bg-white dark:bg-gray-800/50
                   text-gray-600 dark:text-gray-300
                   border border-gray-200 dark:border-gray-700/50
                   hover:bg-indigo-50 dark:hover:bg-gray-700
                   hover:text-indigo-700 dark:hover:text-white
                   hover:border-indigo-200 dark:hover:border-gray-600
                   disabled:opacity-40 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        Generate New Array
      </button>
    </div>
  );
}
