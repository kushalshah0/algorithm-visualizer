import { SortStep } from './types';

function makeStep(
  array: number[],
  overrides: Partial<SortStep> & { description: string }
): SortStep {
  return {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    ...overrides,
  };
}

// ─── Bubble Sort ───────────────────────────────────────────────
export function generateBubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];
  const sorted: number[] = [];

  steps.push(makeStep(arr, { description: 'Starting Bubble Sort' }));

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push(
        makeStep(arr, {
          comparing: [j, j + 1],
          sorted: [...sorted],
          description: `Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`,
        })
      );

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        steps.push(
          makeStep(arr, {
            swapping: [j, j + 1],
            sorted: [...sorted],
            description: `Swapping ${arr[j + 1]} and ${arr[j]} since ${arr[j + 1]} > ${arr[j]}`,
          })
        );
      }
    }
    sorted.push(n - 1 - i);
    if (!swapped) {
      // Everything remaining is sorted
      for (let k = 0; k < n - 1 - i; k++) sorted.push(k);
      steps.push(
        makeStep(arr, {
          sorted: [...sorted],
          description: 'No swaps needed — array is sorted!',
        })
      );
      break;
    }
  }

  // Mark all sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(
    makeStep(arr, {
      sorted: allSorted,
      description: 'Bubble Sort complete!',
    })
  );

  return steps;
}

// ─── Quick Sort ────────────────────────────────────────────────
export function generateQuickSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];
  const sortedIndices = new Set<number>();

  steps.push(makeStep(arr, { description: 'Starting Quick Sort' }));

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) {
        sortedIndices.add(low);
        steps.push(
          makeStep(arr, {
            sorted: [...sortedIndices],
            description: `Element at index ${low} (${arr[low]}) is in its final position`,
          })
        );
      }
      return;
    }

    const pivotVal = arr[high];
    steps.push(
      makeStep(arr, {
        pivot: high,
        sorted: [...sortedIndices],
        description: `Choosing pivot: ${pivotVal} at index ${high}`,
      })
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push(
        makeStep(arr, {
          comparing: [j, high],
          pivot: high,
          sorted: [...sortedIndices],
          description: `Comparing ${arr[j]} with pivot ${pivotVal}`,
        })
      );

      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push(
            makeStep(arr, {
              swapping: [i, j],
              pivot: high,
              sorted: [...sortedIndices],
              description: `Swapping ${arr[j]} and ${arr[i]} (moving smaller element left)`,
            })
          );
        }
      }
    }

    const pivotPos = i + 1;
    if (pivotPos !== high) {
      [arr[pivotPos], arr[high]] = [arr[high], arr[pivotPos]];
      steps.push(
        makeStep(arr, {
          swapping: [pivotPos, high],
          sorted: [...sortedIndices],
          description: `Placing pivot ${pivotVal} at its correct position (index ${pivotPos})`,
        })
      );
    }

    sortedIndices.add(pivotPos);
    steps.push(
      makeStep(arr, {
        sorted: [...sortedIndices],
        description: `Pivot ${pivotVal} is now at its final position (index ${pivotPos})`,
      })
    );

    quickSort(low, pivotPos - 1);
    quickSort(pivotPos + 1, high);
  }

  quickSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(
    makeStep(arr, {
      sorted: allSorted,
      description: 'Quick Sort complete!',
    })
  );

  return steps;
}

// ─── Merge Sort ────────────────────────────────────────────────
export function generateMergeSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];
  const sortedIndices = new Set<number>();

  steps.push(makeStep(arr, { description: 'Starting Merge Sort' }));

  function mergeSort(left: number, right: number) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push(
      makeStep(arr, {
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        sorted: [...sortedIndices],
        description: `Dividing subarray [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`,
      })
    );

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    const mergingIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);

    steps.push(
      makeStep(arr, {
        merging: mergingIndices,
        sorted: [...sortedIndices],
        description: `Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      })
    );

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push(
        makeStep(arr, {
          comparing: [left + i, mid + 1 + j],
          merging: mergingIndices,
          sorted: [...sortedIndices],
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        })
      );

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      steps.push(
        makeStep(arr, {
          swapping: [k],
          merging: mergingIndices,
          sorted: [...sortedIndices],
          description: `Placing ${arr[k]} at index ${k}`,
        })
      );
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push(
        makeStep(arr, {
          swapping: [k],
          merging: mergingIndices,
          sorted: [...sortedIndices],
          description: `Placing remaining element ${arr[k]} at index ${k}`,
        })
      );
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push(
        makeStep(arr, {
          swapping: [k],
          merging: mergingIndices,
          sorted: [...sortedIndices],
          description: `Placing remaining element ${arr[k]} at index ${k}`,
        })
      );
      j++;
      k++;
    }

    // If the entire array has been merged at the top level, mark all sorted
    if (left === 0 && right === n - 1) {
      for (let idx = left; idx <= right; idx++) sortedIndices.add(idx);
    }

    steps.push(
      makeStep(arr, {
        merging: mergingIndices,
        sorted: [...sortedIndices],
        description: `Merged subarray [${left}..${right}]: [${arr.slice(left, right + 1).join(', ')}]`,
      })
    );
  }

  mergeSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(
    makeStep(arr, {
      sorted: allSorted,
      description: 'Merge Sort complete!',
    })
  );

  return steps;
}

export function generateArray(size: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 95) + 5); // 5-99
  }
  return arr;
}
