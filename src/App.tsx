import { useState, useEffect, useRef, useCallback } from 'react';
import { SortAlgorithm, SortStep, PlaybackState } from './types';
import {
  generateArray,
  generateBubbleSortSteps,
  generateQuickSortSteps,
  generateMergeSortSteps,
} from './algorithms';
import { BarChart } from './components/BarChart';
import { Controls } from './components/Controls';
import { Legend } from './components/Legend';
import { AlgorithmInfo } from './components/AlgorithmInfo';
import { ThemeToggle } from './components/ThemeToggle';

/* ────────────────────────────────────────── */

function getSteps(algorithm: SortAlgorithm, array: number[]): SortStep[] {
  switch (algorithm) {
    case 'bubble':
      return generateBubbleSortSteps(array);
    case 'quick':
      return generateQuickSortSteps(array);
    case 'merge':
      return generateMergeSortSteps(array);
  }
}

const algoLabel: Record<SortAlgorithm, string> = {
  bubble: 'Bubble Sort',
  quick: 'Quick Sort',
  merge: 'Merge Sort',
};

/* ────────────────────────────────────────── */

export function App() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(200);
  const [sourceArray, setSourceArray] = useState<number[]>(() => generateArray(20));
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedRef = useRef(speed);
  const stepsRef = useRef(steps);

  // Keep refs in sync
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  // Recompute steps when algo / source changes
  useEffect(() => {
    const newSteps = getSteps(algorithm, sourceArray);
    setSteps(newSteps);
    setCurrentStep(0);
    setPlaybackState('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [algorithm, sourceArray]);

  /* ── Playback helpers ── */
  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= stepsRef.current.length) {
        setPlaybackState('finished');
        return prev;
      }
      return next;
    });
  }, []);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev <= 0) return 0;
      setPlaybackState('paused');
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (playbackState !== 'playing') {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    function tick() {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= stepsRef.current.length) {
          setPlaybackState('finished');
          return prev;
        }
        timerRef.current = setTimeout(tick, speedRef.current);
        return next;
      });
    }
    timerRef.current = setTimeout(tick, speedRef.current);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playbackState]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setPlaybackState('playing');
  };
  const handlePause = () => setPlaybackState('paused');
  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(0);
    setPlaybackState('idle');
  };
  const handleAlgorithmChange = (algo: SortAlgorithm) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAlgorithm(algo);
  };
  const handleArraySizeChange = (size: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setArraySize(size);
    setSourceArray(generateArray(size));
  };
  const handleNewArray = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSourceArray(generateArray(arraySize));
  };
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    if (step >= steps.length - 1) setPlaybackState('finished');
    else if (playbackState === 'finished') setPlaybackState('paused');
  };

  /* ── Derived data ── */
  const defaultStep: SortStep = {
    array: sourceArray,
    comparing: [],
    swapping: [],
    sorted: [],
    description: 'Ready — press Play to begin.',
  };
  const currentStepData = steps[currentStep] ?? steps[0] ?? defaultStep;
  const maxValue = Math.max(...sourceArray, 1);

  /* ── Status badge config ── */
  const statusStyles: Record<PlaybackState, string> = {
    playing:
      'bg-emerald-100 text-emerald-700 ring-emerald-300/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
    paused:
      'bg-amber-100 text-amber-700 ring-amber-300/60 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
    finished:
      'bg-indigo-100 text-indigo-700 ring-indigo-300/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/30',
    idle: 'bg-gray-100 text-gray-500 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700',
  };
  const statusLabel: Record<PlaybackState, string> = {
    playing: '● Playing',
    paused: '❚❚ Paused',
    finished: '✓ Finished',
    idle: '○ Ready',
  };

  /* ────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/40 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/60 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Sorting Visualizer
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5 font-medium">
                Interactive Algorithm Visualization
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Status badge */}
          <div
            className={`hidden sm:flex px-3 py-1 rounded-full text-[11px] font-semibold ring-1 transition-colors duration-200 ${statusStyles[playbackState]}`}
          >
            {statusLabel[playbackState]}
          </div>
        </div>
      </header>

      {/* ═══════ BODY ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── Main Visualization ─── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Chart card */}
            <div className="bg-white/70 dark:bg-gray-900/50 rounded-2xl border border-gray-200/80 dark:border-gray-800/60 overflow-hidden shadow-sm dark:shadow-none backdrop-blur-sm transition-colors duration-300">
              {/* Top info bar */}
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {algoLabel[algorithm]}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{sourceArray.length} elements</span>
                </div>
                <div className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                  Step {currentStep} / {steps.length - 1}
                </div>
              </div>

              {/* Chart */}
              <div className="p-4 bg-gradient-to-b from-transparent via-transparent to-gray-50/60 dark:to-gray-900/40">
                <BarChart step={currentStepData} maxValue={maxValue} />
              </div>

              {/* Legend */}
              <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800/40">
                <Legend />
              </div>
            </div>

            {/* Step description */}
            <div className="bg-white/70 dark:bg-gray-900/50 rounded-xl border border-gray-200/80 dark:border-gray-800/60 px-5 py-4 shadow-sm dark:shadow-none backdrop-blur-sm transition-colors duration-300">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                    {currentStepData.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                    <span>
                      Comparisons:{' '}
                      {currentStepData.comparing.length > 0 ? currentStepData.comparing.length : '—'}
                    </span>
                    <span>
                      Sorted: {currentStepData.sorted.length} / {sourceArray.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-5">
            <div className="bg-white/70 dark:bg-gray-900/50 rounded-2xl border border-gray-200/80 dark:border-gray-800/60 p-5 shadow-sm dark:shadow-none backdrop-blur-sm transition-colors duration-300">
              <Controls
                algorithm={algorithm}
                onAlgorithmChange={handleAlgorithmChange}
                playbackState={playbackState}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                speed={speed}
                onSpeedChange={setSpeed}
                arraySize={arraySize}
                onArraySizeChange={handleArraySizeChange}
                currentStep={currentStep}
                totalSteps={steps.length}
                onStepChange={handleStepChange}
                onNewArray={handleNewArray}
              />
            </div>

            <AlgorithmInfo algorithm={algorithm} />
          </div>
        </div>
      </div>
    </div>
  );
}
