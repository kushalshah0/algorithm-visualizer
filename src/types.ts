export type SortAlgorithm = 'bubble' | 'quick' | 'merge';

export interface SortStep {
  array: number[];
  comparing: number[];    // indices being compared
  swapping: number[];     // indices being swapped
  sorted: number[];       // indices confirmed sorted
  pivot?: number;         // pivot index for quicksort
  merging?: number[];     // indices being merged
  description: string;
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';
