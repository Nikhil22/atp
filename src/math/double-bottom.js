function isBasicW(highest, lowOne, lowTwo, mid) {
  return (
    highest >= mid
    && lowTwo >= lowOne
    && mid > lowTwo
  );
}

function areThresholdsMet(lowOne, lowTwo, mid) {
  return (
    isBottomDiffThresholdMet(lowOne, lowTwo)
    && isMidpointThresholdMet(mid, lowOne)
  );
}

function isBottomDiffThresholdMet(lowOne, lowTwo) {
  const BOTTOM_DIFF_THRESHOLD_HIGH = 0.0008
  const BOTTOM_DIFF_THRESHOLD_LOW = 0;

  const pctDiff = (lowTwo - lowOne) / lowOne;

  return pctDiff >= BOTTOM_DIFF_THRESHOLD_LOW && pctDiff <= BOTTOM_DIFF_THRESHOLD_HIGH;
}

function isMidpointThresholdMet(mid, lowOne) {
  const MIDPOINT_THRESHOLD_HIGH = 0.003;
  const MIDPOINT_THRESHOLD_LOW = 0.001;

  const pctDiff = (mid - lowOne) / lowOne;

  return pctDiff >= MIDPOINT_THRESHOLD_LOW && pctDiff <= MIDPOINT_THRESHOLD_HIGH;
}

/*
@params:
  data: Array of numbers ([open, high, low, close])
  RANGE: Number length to evaluate presence of double bottom
    - Default value: 14

@returns boolean
  true if double bottom detected
  false if not

Basic algorithm:
  Set lowTwo and mid to null
  Set previousMid and previousLowTwo to null (need these for pullbacks)
  Set lowOne to beg, high to end
  Start from beginning of range, traverse until end:
    Update highest if necessary
    if candidate is less than lowOne
      update lowOne
      mid and lowTwo back to null
      continue to next iteration
    if next is less than lowOne
      update lowOne
      mid and lowTwo back to null
      continue to next iteration
    if previous and next are lower than mid, and candidate > mid
      update previousMid
      update mid
      update previousLowTwo
      set lowTwo to next
      continue to next iteration
    if mid is set and candidate is less than lowTwo
      update previousLowTwo
      update lowTwo
  if mid === highest (in the case of pullbacks)
    set mid back to previousMid
    set lowTwo back to previousLowTwo
  Return false if lowOne, lowTwo, mid or high is null
  Return true if basic W and thresholds met, else return false
*/
export const isDoubleBottom = (data, RANGE=14) => {
  if (RANGE > data.length) {
    RANGE = data.length;
  }
  let startIdx = data.length - RANGE;
  let lowOne = data[startIdx];
  let lowTwo = null;
  let mid = null;
  let previousMid = null;
  let previousLowTwo = null;
  let highest = data[data.length - 1];

  for (let i = startIdx + 1; i < data.length - 1; i++) {
    const candidate = data[i];

    if (candidate > highest) {
      highest = candidate;
    }

    if (candidate < lowOne) {
      lowOne = candidate;
      mid = null;
      lowTwo = null;
      continue;
    }

    const prev = data[i - 1];
    const next = data[i + 1]
    if (next < lowOne) {
      lowOne = next;
      mid = null;
      lowTwo = null;
      continue;
    }

    if (candidate > prev && candidate > next && candidate > mid) {
      previousMid = mid;
      mid = candidate;
      previousLowTwo = lowTwo;
      lowTwo = next;
      continue;
    }

    if (mid && candidate < lowTwo) {
      previousLowTwo = lowTwo;
      lowTwo = candidate;
    }
  }

  if (mid === highest) {
    mid = previousMid
    lowTwo = previousLowTwo;
  }

  if ([lowOne, lowTwo, mid, highest].some(el => el === null)) {
    return false;
  }

  return (
    isBasicW(highest, lowOne, lowTwo, mid)
    && areThresholdsMet(lowOne, lowTwo, mid)
  );
}
