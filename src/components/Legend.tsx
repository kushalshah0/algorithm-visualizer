const items = [
  { color: 'bg-indigo-500 dark:bg-indigo-400', label: 'Unsorted' },
  { color: 'bg-amber-500 dark:bg-amber-400', label: 'Comparing' },
  { color: 'bg-rose-500', label: 'Swapping' },
  { color: 'bg-purple-500', label: 'Pivot' },
  { color: 'bg-sky-500 dark:bg-sky-400', label: 'Merging' },
  { color: 'bg-emerald-500', label: 'Sorted' },
];

export function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-sm ${item.color}`} />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
