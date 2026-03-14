import { SortAlgorithm } from '../types';

const info: Record<
  SortAlgorithm,
  {
    name: string;
    best: string;
    avg: string;
    worst: string;
    space: string;
    stable: boolean;
    description: string;
  }
> = {
  bubble: {
    name: 'Bubble Sort',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Simple but inefficient for large datasets.',
  },
  quick: {
    name: 'Quick Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    description:
      'Selects a pivot element and partitions the array around it so that smaller elements go left and larger go right. Very efficient in practice.',
  },
  merge: {
    name: 'Merge Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    description:
      'Divides the array into halves, recursively sorts them, then merges the sorted halves. Guarantees O(n log n) performance regardless of input.',
  },
};

export function AlgorithmInfo({ algorithm }: { algorithm: SortAlgorithm }) {
  const data = info[algorithm];

  return (
    <div className="bg-white/60 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800/60 shadow-sm dark:shadow-none backdrop-blur-sm transition-colors duration-300">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{data.name}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{data.description}</p>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Best', value: data.best },
          { label: 'Average', value: data.avg },
          { label: 'Worst', value: data.worst },
          { label: 'Space', value: data.space },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-gray-100/80 dark:bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-200/50 dark:border-gray-700/30"
          >
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
              {item.label}
            </span>
            <span className="block text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-300 mt-0.5">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={`inline-block w-2 h-2 rounded-full ${data.stable ? 'bg-emerald-500' : 'bg-rose-500'}`}
        />
        <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">
          {data.stable ? 'Stable sort' : 'Not stable'}
        </span>
      </div>
    </div>
  );
}
