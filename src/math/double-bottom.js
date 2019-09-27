function isBasicW(high, lowOne, lowTwo, mid) {
  return (
    high >= mid
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
  Set lowOne to beg, high to end
  Start from beginning of range, traverse until end:
    if candidate is less than lowOne
      update lowOne
      mid and lowTwo back to null
      continue to next iteration
    if next is less than lowOne
      update lowOne
      mid and lowTwo back to null
      continue to next iteration
    if previous and next are lower than mid
      update mid
      set lowTwo to next
      continue to next iteration
    if mid is set and candidate is less than lowTwo
      update lowTwo
  Return false if lowOne, lowTwo, mid or high is null
  Return true if basic W and thresholds met, else return false
*/
export const isDoubleBottom = (data, RANGE=14) => {
  // TODO - distance between both bottoms should be a factor
  // TODO - should return yes even during pullback.
  if (RANGE > data.length) {
    RANGE = data.length;
  }
  let startIdx = data.length - RANGE;
  let lowOne = data[startIdx];
  let lowTwo = null;
  let mid = null;
  let high = data[data.length - 1];

  for (let i = startIdx + 1; i < data.length - 1; i++) {
    const candidate = data[i];
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

    if (candidate > prev && candidate > next) {
      mid = candidate;
      lowTwo = next;
      continue;
    }

    if (mid && candidate < lowTwo) {
      lowTwo = candidate;
    }
  }

  if ([lowOne, lowTwo, mid, high].some(el => el === null)) {
    return false;
  }

  return (
    isBasicW(high, lowOne, lowTwo, mid)
    && areThresholdsMet(lowOne, lowTwo, mid)
  );
}
